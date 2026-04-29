import { Loader } from "lucide-react";

export default function Loading() {
    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center gap-y-5">
                <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center">
                    <Loader className="text-muted-foreground animate-spin" size={32} />
                </div>
            </div>
        </>
    );
}