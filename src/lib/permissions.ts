/**
 * Centralized Role & Ownership Authorization Helper for PakistanTravel.Agency
 * Enforces strict Server-Side Role-Based Access Control (RBAC) and IDOR isolation.
 */

export interface AuthSession {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: "ADMIN" | "VENDOR" | "CUSTOMER" | "USER" | string;
    vendorId?: string | null;
    staffRole?: string | null;
    permissions?: string | null;
  };
}

export interface AuthCheckResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  error?: string;
}

/**
 * Validates that an active session exists and matches at least one of the specified roles.
 * Returns 401 for anonymous / unauthenticated requests, and 403 for unauthorized roles.
 */
export function requireRole(
  session: AuthSession | null | undefined,
  allowedRoles: Array<"ADMIN" | "VENDOR" | "CUSTOMER" | "USER" | string>
): AuthCheckResult {
  if (!session || !session.user) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized: Active session required.",
    };
  }

  const userRole = session.user.role || "USER";
  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      status: 403,
      error: `Forbidden: Access restricted. Role '${userRole}' is not permitted.`,
    };
  }

  return { authorized: true, status: 200 };
}

/**
 * Enforces multi-tenant vendor isolation.
 * Admins are permitted unrestricted access.
 * Vendors can ONLY access or mutate resources where resourceVendorId matches their own vendorId.
 */
export function requireVendorOwnership(
  session: AuthSession | null | undefined,
  resourceVendorId: string | null | undefined
): AuthCheckResult {
  const roleCheck = requireRole(session, ["ADMIN", "VENDOR"]);
  if (!roleCheck.authorized) {
    return roleCheck;
  }

  if (session?.user?.role === "ADMIN") {
    return { authorized: true, status: 200 };
  }

  if (!resourceVendorId) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Target resource has no assigned vendor owner.",
    };
  }

  const currentVendorId = session?.user?.vendorId;
  if (!currentVendorId || currentVendorId !== resourceVendorId) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: You do not own this listing, booking, or financial ledger entry.",
    };
  }

  return { authorized: true, status: 200 };
}

/**
 * Enforces customer or admin ownership check.
 */
export function requireCustomerOwnership(
  session: AuthSession | null | undefined,
  customerEmail: string | null | undefined
): AuthCheckResult {
  const roleCheck = requireRole(session, ["ADMIN", "CUSTOMER", "USER", "VENDOR"]);
  if (!roleCheck.authorized) {
    return roleCheck;
  }

  if (session?.user?.role === "ADMIN") {
    return { authorized: true, status: 200 };
  }

  if (!customerEmail || !session?.user?.email) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Customer email verification failed.",
    };
  }

  if (session.user.email.toLowerCase().trim() !== customerEmail.toLowerCase().trim()) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: You cannot view or modify another customer's booking or account.",
    };
  }

  return { authorized: true, status: 200 };
}

/**
 * Unified resource ownership check.
 * Verifies multi-tenant vendor isolation or customer identity.
 * Administrators bypass ownership constraints.
 */
export function requireOwnership(
  session: AuthSession | null | undefined,
  resource: { vendorId?: string | null; customerEmail?: string | null; userId?: string | null }
): AuthCheckResult {
  if (!session || !session.user) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized: Active session required.",
    };
  }

  if (session.user.role === "ADMIN") {
    return { authorized: true, status: 200 };
  }

  if (resource.vendorId !== undefined) {
    if (session.user.role !== "VENDOR") {
      return {
        authorized: false,
        status: 403,
        error: "Forbidden: Vendor credentials required to access this resource.",
      };
    }
    const currentVendorId = session.user.vendorId;
    if (!currentVendorId || currentVendorId !== resource.vendorId) {
      return {
        authorized: false,
        status: 403,
        error: "Forbidden: You do not own this vendor resource.",
      };
    }
    return { authorized: true, status: 200 };
  }

  if (resource.customerEmail !== undefined || resource.userId !== undefined) {
    const isEmailMatch =
      Boolean(resource.customerEmail &&
      session.user.email &&
      session.user.email.toLowerCase().trim() === resource.customerEmail.toLowerCase().trim());
    const isIdMatch = Boolean(resource.userId && session.user.id && session.user.id === resource.userId);

    if (!isEmailMatch && !isIdMatch) {
      return {
        authorized: false,
        status: 403,
        error: "Forbidden: You cannot access or modify another user's records.",
      };
    }
    return { authorized: true, status: 200 };
  }

  return { authorized: false, status: 403, error: "Forbidden: Ownership verification failed." };
}
