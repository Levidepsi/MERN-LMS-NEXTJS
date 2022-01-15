import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
const CourseCreate = () => {
	return (
		<InstructorRoute>
			<h1
				className='jumbotron text-center bg-primary square '
				style={{ display: "grid", height: "10vh" }}
			>
				Create Course
			</h1>
		</InstructorRoute>
	);
};

export default CourseCreate;
