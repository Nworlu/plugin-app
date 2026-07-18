type SessionInvalidHandler = () => void | Promise<void>;

let sessionInvalidHandler: SessionInvalidHandler | null = null;
let isHandlingSessionInvalid = false;

export function isSessionInvalidError(
  status: number,
  message?: string,
): boolean {
  const normalizedMessage = message?.toLowerCase().trim() ?? "";

  if (status === 403 && normalizedMessage.includes("jwt expired")) {
    return true;
  }

  return false;
}

export function onSessionInvalid(handler: SessionInvalidHandler) {
  sessionInvalidHandler = handler;
}

export async function triggerSessionInvalid() {
  if (isHandlingSessionInvalid || !sessionInvalidHandler) {
    return;
  }

  isHandlingSessionInvalid = true;
  try {
    await sessionInvalidHandler();
  } finally {
    isHandlingSessionInvalid = false;
  }
}
