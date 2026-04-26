const requestStore = new Map();

export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now();

  const current = requestStore.get(key) || {
    count: 0,
    startTime: now,
  };

  if (now - current.startTime > windowMs) {
    requestStore.set(key, {
      count: 1,
      startTime: now,
    });

    return {
      allowed: true,
      remaining: limit - 1,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  current.count += 1;
  requestStore.set(key, current);

  return {
    allowed: true,
    remaining: limit - current.count,
  };
}