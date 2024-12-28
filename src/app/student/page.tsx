import StudentInfoCard from "@/components/StudentInfoCard";
import StudentNavbar from "@/components/StudentNavbar";
import StudentPassList from "@/components/StudentPassList";

export default function Student() {
    return(
        <div>
            <StudentNavbar />
            <StudentInfoCard />
            <StudentPassList />
        </div>
    )
}