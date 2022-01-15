import Link from "next/link";

const InstructorNav = () => {
	return (
		<div className='nav flex-column nav-pills mt-2'>
			<Link href='/user'>
				<a className='nav-link active'>Dashboard</a>
			</Link>
			<Link href='/instructor/course/create'>
				<a className='nav-link '>Course Create</a>
			</Link>
		</div>
	);
};

export default InstructorNav;
