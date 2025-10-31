import {SickLeaveForm} from "../components/SickLeaveForm.tsx";
import {SickLeaveList} from "../components/SickLeaveList.tsx";
import {Header} from "../components/Header.tsx";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <SickLeaveForm />
                    <SickLeaveList />
                </div>
            </main>
        </div>
    );
};

export default Index;
