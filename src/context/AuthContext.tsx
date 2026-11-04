import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types/database';

export interface Permissions {
  canAccessPos: boolean;
  canAccessInventory: boolean;
  canAccessProducts: boolean;
  canAccessAccounting: boolean;
  canAccessGst: boolean;
  canAccessPurchases: boolean;
  canAccessSuppliers: boolean;
  canAccessCustomers: boolean;
  canAccessOnlineOrders: boolean;
  canAccessEmployees: boolean;
  canAccessReports: boolean;
  canAccessSettings: boolean;
  canDeleteInvoice: boolean;
  canOverrideStock: boolean;
  canApproveDiscount: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
  owner: {
    canAccessPos: true,
    canAccessInventory: true,
    canAccessProducts: true,
    canAccessAccounting: true,
    canAccessGst: true,
    canAccessPurchases: true,
    canAccessSuppliers: true,
    canAccessCustomers: true,
    canAccessOnlineOrders: true,
    canAccessEmployees: true,
    canAccessReports: true,
    canAccessSettings: true,
    canDeleteInvoice: true,
    canOverrideStock: true,
    canApproveDiscount: true,
  },
  accountant: {
    canAccessPos: true,
    canAccessInventory: false,
    canAccessProducts: false,
    canAccessAccounting: true,
    canAccessGst: true,
    canAccessPurchases: true,
    canAccessSuppliers: true,
    canAccessCustomers: true,
    canAccessOnlineOrders: false,
    canAccessEmployees: false,
    canAccessReports: true,
    canAccessSettings: false,
    canDeleteInvoice: false,
    canOverrideStock: false,
    canApproveDiscount: false,
  },
  manager: {
    canAccessPos: true,
    canAccessInventory: true,
    canAccessProducts: true,
    canAccessAccounting: true,
    canAccessGst: false,
    canAccessPurchases: true,
    canAccessSuppliers: true,
    canAccessCustomers: true,
    canAccessOnlineOrders: true,
    canAccessEmployees: true,
    canAccessReports: true,
    canAccessSettings: false,
    canDeleteInvoice: false,
    canOverrideStock: true,
    canApproveDiscount: true,
  },
  cashier: {
    canAccessPos: true,
    canAccessInventory: false,
    canAccessProducts: false,
    canAccessAccounting: false,
    canAccessGst: false,
    canAccessPurchases: false,
    canAccessSuppliers: false,
    canAccessCustomers: true,
    canAccessOnlineOrders: true,
    canAccessEmployees: false,
    canAccessReports: false,
    canAccessSettings: false,
    canDeleteInvoice: false,
    canOverrideStock: false,
    canApproveDiscount: false,
  },
  salesperson: {
    canAccessPos: true,
    canAccessInventory: false,
    canAccessProducts: false,
    canAccessAccounting: false,
    canAccessGst: false,
    canAccessPurchases: false,
    canAccessSuppliers: false,
    canAccessCustomers: false,
    canAccessOnlineOrders: false,
    canAccessEmployees: false,
    canAccessReports: false,
    canAccessSettings: false,
    canDeleteInvoice: false,
    canOverrideStock: false,
    canApproveDiscount: false,
  }
};

const DEFAULT_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Jonny Sethi',
    email: 'jonny.sethi@sethiboothouse.com',
    phone: '+91 98960 12345',
    role: 'owner',
    branchId: 'b-ratia-1',
    active: true,
    avatar: 'JS'
  },
  {
    id: 'u-2',
    name: 'Ramesh Bansal (Munim Ji)',
    email: 'ramesh.accountant@sethiboothouse.com',
    phone: '+91 94160 54321',
    role: 'accountant',
    branchId: 'b-ratia-1',
    active: true,
    avatar: 'RB'
  },
  {
    id: 'u-3',
    name: 'Gurpreet Singh',
    email: 'gurpreet.cashier@sethiboothouse.com',
    phone: '+91 98120 78901',
    role: 'cashier',
    branchId: 'b-ratia-1',
    active: true,
    avatar: 'GS'
  }
];

interface AuthContextType {
  currentUser: User;
  users: User[];
  permissions: Permissions;
  switchUser: (userId: string) => void;
  checkPermission: (key: keyof Permissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('sbh_active_user_id') || 'u-1';
  });

  const currentUser = DEFAULT_USERS.find(u => u.id === currentUserId) || DEFAULT_USERS[0];
  const permissions = ROLE_PERMISSIONS[currentUser.role];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('sbh_active_user_id', userId);
  };

  const checkPermission = (key: keyof Permissions): boolean => {
    return !!permissions[key];
  };

  return (
    <AuthContext.Provider value={{ currentUser, users: DEFAULT_USERS, permissions, switchUser, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
