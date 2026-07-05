import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createApplication: vi.fn().mockResolvedValue(undefined),
  listApplications: vi.fn().mockResolvedValue([
    {
      id: 1,
      fullName: "Test Kullanıcı",
      email: "test@example.com",
      phone: "05551234567",
      amount: "10.000 TL",
      description: "Test açıklama",
      imageKey: null,
      imageUrl: null,
      createdAt: Date.now(),
    },
  ]),
  getApplicationById: vi.fn().mockResolvedValue({
    id: 1,
    fullName: "Test Kullanıcı",
    email: "test@example.com",
    phone: "05551234567",
    amount: "10.000 TL",
    description: "Test açıklama",
    imageKey: null,
    imageUrl: null,
    createdAt: Date.now(),
  }),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test-key", url: "/manus-storage/test-key" }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner-open-id",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user-id",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("application.submit", () => {
  it("allows public users to submit an application", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.application.submit({
      fullName: "Test Kullanıcı",
      email: "test@example.com",
      phone: "05551234567",
      amount: "10.000 TL",
      description: "Test başvuru açıklaması",
    });

    expect(result).toEqual({ success: true });
  });

  it("validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.application.submit({
        fullName: "Test",
        email: "invalid-email",
        phone: "05551234567",
        amount: "10.000 TL",
        description: "Test",
      }),
    ).rejects.toThrow();
  });
});

describe("application.list", () => {
  it("allows admin to list applications", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.application.list();

    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe("Test Kullanıcı");
  });

  it("denies non-admin users from listing applications", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.application.list()).rejects.toThrow();
  });

  it("denies unauthenticated users from listing applications", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.application.list()).rejects.toThrow();
  });
});

describe("application.getById", () => {
  it("allows admin to get application by id", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.application.getById({ id: 1 });

    expect(result).not.toBeNull();
    expect(result?.fullName).toBe("Test Kullanıcı");
  });

  it("denies regular users from getting application details", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.application.getById({ id: 1 })).rejects.toThrow();
  });
});
