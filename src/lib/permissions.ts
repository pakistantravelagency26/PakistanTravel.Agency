/**
 * Centralized Role & Ownership Authorization Helper for PakistanTravel.Agency
 * Enforces strict Server-Side Role-Based Access Control (RBAC) and IDOR isolation.
 */

export interface AuthSession {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: "ADMIN" | "VENDOR" | "USER" | string;
    vendorId?: string | null;
  };
}

export interface AuthCheckResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  error?: string;
}

/**
 * Validates that an active session exists and matches at least one of the specified roles.
 */
export function requireRole(
  session: AuthSession | null | undefined,
  allowedRoles: Array<"ADMIN" | "VENDOR" | "USER" | string>
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
  const roleCheck = requireRole(session, ["ADMIN", "USER", "VENDOR"]);
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
