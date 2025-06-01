import React, { useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatDetail from "../components/ChatDetail";

const Chat = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Trigger refresh
    const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

    return (
        <div className="flex justify-center items-center h-full w-full px-2">
            <div className="flex flex-col md:flex-row h-[80vh] min-h-0 w-full max-w-6xl bg-[var(--sec)] rounded-lg shadow-lg p-4 gap-4 my-4 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`w-full md:w-1/3 flex flex-col h-full min-h-0 ${
                        !selectedTeam ? "" : "hidden md:flex"
                    } md:border-r-2 md:border-gray-400`}
                >
                    <div className="flex items-center justify-center border-b-2 border-[var(--prim)] px-4 py-2">
                        <h2 className="text-2xl font-bold">Stacks</h2>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <ChatSidebar
                            setSelectedTeam={setSelectedTeam}
                            selectedTeam={selectedTeam}
                            refreshKey={refreshKey}
                        />
                    </div>
                </aside>

                {/* Chat detail */}
                <section
                    className={`w-full h-full md:w-2/3 ${
                        selectedTeam ? "" : "hidden md:block"
                    }`}
                >
                    {selectedTeam ? (
                        <div className="h-full flex flex-col">
                            <button
                                type="button"
                                className="md:hidden text-sm text-white mb-2 self-start"
                                onClick={() => setSelectedTeam(null)}
                            >
                                <i className="fas fa-arrow-left scale-120 btn"></i>
                            </button>
                            <ChatDetail
                                teamId={selectedTeam}
                                onNewMessage={triggerRefresh}
                            />
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full">
                            <p className="text-gray-300 italic text-center">
                                ¡Chatea con tus stacks!
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Chat;
