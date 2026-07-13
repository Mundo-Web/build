"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import General from "../../../../Utils/General";

export default function BancoDropdownTwenty({ contacts }) {
    const [openItems, setOpenItems] = useState({});

    let accountsString = General.get("transfer_accounts");
    if (!accountsString && contacts && Array.isArray(contacts)) {
        const transferAccounts = contacts.find(
            (x) => x.correlative === "transfer_accounts",
        );
        accountsString = transferAccounts ? transferAccounts.description : null;
    }

    const accounts = accountsString ? JSON.parse(accountsString) : [];

    const toggleItem = (index) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (accounts.length === 0) {
        return (
            <div className="max-w-md w-full bg-white/5 border border-white/10 p-4 rounded-none">
                <p className="text-white/50 text-xs font-paragraph uppercase tracking-wider">
                    No hay cuentas bancarias registradas
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {accounts.map((account, index) => (
                <div key={index} className="max-w-md w-full border border-white/10 rounded-none bg-black">
                    <div className="bg-white/5 p-4 rounded-none">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleItem(index)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-none flex items-center justify-center overflow-hidden bg-white p-1">
                                    {account.image ? (
                                        <img
                                            src={`/assets/resources/${account.image}`}
                                            alt={account.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-black font-bold text-lg">
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="24"
                                                height="24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <span className="font-paragraph font-bold text-xs uppercase tracking-widest text-white">
                                    {account.name || `Cuenta Bancaria ${index + 1}`}
                                </span>
                            </div>
                            {openItems[index] ? (
                                <ChevronUp className="text-white" size={16} />
                            ) : (
                                <ChevronDown className="text-white" size={16} />
                            )}
                        </div>
                    </div>

                    {openItems[index] && (
                        <div className="bg-black p-4 pt-4 border-t border-white/10 rounded-none">
                            <div className="grid grid-cols-1 gap-4">
                                {account.cc && (
                                    <div>
                                        <p className="text-[9px] font-paragraph uppercase tracking-widest text-white/50 mb-1">
                                            Número de Cuenta
                                        </p>
                                        <p className="text-white font-paragraph font-bold text-xs">
                                            {account.cc}
                                        </p>
                                    </div>
                                )}
                                {account.cci && (
                                    <div>
                                        <p className="text-[9px] font-paragraph uppercase tracking-widest text-white/50 mb-1">
                                            Código Interbancario
                                        </p>
                                        <p className="text-white font-paragraph font-bold text-xs">
                                            {account.cci}
                                        </p>
                                    </div>
                                )}
                                {account.description && (
                                    <div>
                                        <p className="text-[9px] font-paragraph uppercase tracking-widest text-white/50 mb-1">
                                            Descripción
                                        </p>
                                        <p className="text-white/70 font-paragraph text-xs leading-relaxed">
                                            {account.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
