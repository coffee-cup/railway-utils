import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, type MouseEvent } from "react";

interface ApiResponse {
  info: { serverStartTime: string; requestTime: string; hasRedis: boolean };
  variables: Record<string, string>;
}

interface RedisResponse {
  ok?: boolean;
  setGetDelMs?: number;
  error?: string;
}

function copyWithEmoji(e: MouseEvent, text: string) {
  navigator.clipboard.writeText(text);
  const emoji = document.createElement("span");
  emoji.textContent = "👍";
  emoji.className = "float-up";
  emoji.style.left = `${e.clientX}px`;
  emoji.style.top = `${e.clientY}px`;
  document.body.appendChild(emoji);
  emoji.addEventListener("animationend", () => emoji.remove());
}

function Copyable({ children, value, className }: { children: React.ReactNode; value: string; className?: string }) {
  const handleClick = useCallback((e: MouseEvent) => copyWithEmoji(e, value), [value]);
  return (
    <span onClick={handleClick} className={`cursor-pointer hover:opacity-80 ${className ?? ""}`}>
      {children}
    </span>
  );
}

export function App() {
  const { data, error } = useQuery({
    queryKey: ["info"],
    queryFn: () => fetch("/api/info").then(r => r.json() as Promise<ApiResponse>),
  });

  const redisMutation = useMutation({
    mutationFn: () => fetch("/api/redis").then(r => r.json() as Promise<RedisResponse>),
  });

  return (
    <div className="grid grid-cols-[1fr_min(65rem,100%)_1fr] py-16">
      <div className="col-start-2 px-4 space-y-8">
        {error && <p className="text-red-400">{error.message}</p>}

        {data && (
          <>
            <section>
              <h1 className="text-3xl font-bold mb-4">Server Info</h1>
              <div className="bg-[#141414] rounded-xl p-4 font-mono text-sm">
                <div className="py-1 flex">
                  <Copyable value="Server Start" className="text-[#a3d5f3] min-w-[200px]">Server Start</Copyable>
                  <span className="text-gray-400 mx-2">=</span>
                  <Copyable value={data.info.serverStartTime} className="text-white">{data.info.serverStartTime}</Copyable>
                </div>
                <div className="py-1 flex">
                  <Copyable value="Request Time" className="text-[#a3d5f3] min-w-[200px]">Request Time</Copyable>
                  <span className="text-gray-400 mx-2">=</span>
                  <Copyable value={data.info.requestTime} className="text-white">{data.info.requestTime}</Copyable>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Actions</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => fetch("/api/crash").finally(() => location.reload())}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                >
                  Crash
                </button>
              </div>
            </section>

            {data.info.hasRedis && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Redis</h2>
                <div className="grid gap-4">
                  <div className={`bg-[#141414] rounded-lg px-4 py-2 font-mono text-sm w-fit min-h-[36px] ${redisMutation.data ? "" : "invisible"} ${redisMutation.isPending ? "opacity-50" : ""}`}>
                    {redisMutation.data?.error ? (
                      <span className="text-red-400">{redisMutation.data.error}</span>
                    ) : (
                      <span className="text-green-400">SET + GET + DEL took {redisMutation.data?.setGetDelMs}ms</span>
                    )}
                  </div>
                  <button
                    onClick={() => redisMutation.mutate()}
                    disabled={redisMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium cursor-pointer w-fit"
                  >
                    {redisMutation.isPending ? "Testing..." : "Test Redis"}
                  </button>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-4">Railway Variables</h2>
              {Object.keys(data.variables).length === 0 ? (
                <p className="text-gray-400">No RAILWAY_* variables found</p>
              ) : (
                <div className="bg-[#141414] rounded-xl p-4 font-mono text-sm">
                  {Object.entries(data.variables).map(([key, value]) => (
                    <div key={key} className="py-1 flex">
                      <Copyable value={key} className="text-[#f3d5a3] min-w-[300px]">{key}</Copyable>
                      <span className="text-gray-400 mx-2">=</span>
                      <Copyable value={value} className="text-white break-all">{value}</Copyable>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
