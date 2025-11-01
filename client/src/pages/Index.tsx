import {SickLeaveForm} from "../components/SickLeaveForm.tsx";
import {SickLeaveList} from "../components/SickLeaveList.tsx";
import {Header} from "../components/Header.tsx";

const Index = () => {
    return (
        <div className="min-h-screen bg-background px-0 sm:px-4">
            <Header />
            <main className="w-full -mx-[2px] sm:mx-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-7xl mx-auto">
                    <SickLeaveForm />
                    <SickLeaveList />
                </div>
            </main>
        </div>
    );
};

export default Index;
