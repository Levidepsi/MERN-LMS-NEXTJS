import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { Context } from "../context";

const Register = () => {
	const [name, setName] = useState("levi");
	const [email, setEmail] = useState("levidepsi7@gmail.com");
	const [password, setPassword] = useState("123456");
	const [loading, setLoading] = useState(false);

	const {
		state: { user },
		dispatch
	} = useContext(Context);

	const router = useRouter();

	useEffect(() => {
		if (user !== null) router.push("/");
	});

	const handleSubmit = async e => {
		try {
			setLoading(true);
			e.preventDefault();
			const { data } = await axios.post(`/api/register`, {
				name,
				email,
				password
			});

			console.log(data);
			toast.success("REGISTERED");
			setName("");
			setEmail("");
			setPassword("");
			setLoading(false);
		} catch (error) {
			console.log(error);
			toast.error("Email Taken");
			setLoading(false);
		}
	};
	return (
		<>
			<h1
				className='jumbotron text-center bg-primary square'
				style={{ display: "grid" }}
			>
				Register
			</h1>
			<div className='container col-md-4 offset-md-4 pb-5'>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						className='form-control mb-4 p-4'
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder='EnterName'
						required
					/>

					<input
						type='email'
						className='form-control mb-4 p-4'
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder='Enter Email'
						required
					/>

					<input
						type='password'
						className='form-control mb-4 p-4'
						value={password}
						onChange={e => setPassword(e.target.name)}
						placeholder='Enter Password'
						required
					/>
					<div className='d-grid gap-2'>
						<button
							type='submit'
							className='btn btn-block btn-primary'
							disabled={!name || !email || !password || loading}
						>
							{loading ? <SyncOutlined spin /> : "Submit"}
						</button>
					</div>
				</form>
				<p className='text-center p-3'>
					Already Registered?
					<Link href='/login'>
						<a>Login</a>
					</Link>
				</p>
			</div>
		</>
	);
};

export default Register;
