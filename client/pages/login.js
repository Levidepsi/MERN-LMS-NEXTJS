import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
	const [email, setEmail] = useState("levidepsi7@gmail.com");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const {
		state: { user },
		dispatch
	} = useContext(Context);

	const router = useRouter();

	useEffect(() => {
		if (user !== null) router.push("/");
	}, [user]);

	// console.log(state);
	const handleSubmit = async e => {
		try {
			setLoading(true);
			e.preventDefault();
			const { data } = await axios.post(`/api/login`, {
				email,
				password
			});
			// console.log(data);
			dispatch({
				type: "LOGIN",
				payload: data
			});
			window.localStorage.setItem("user", JSON.stringify(data));
			router.push("/user");
			// toast.success("Succe");
			setLoading(false);
		} catch (error) {
			console.log(error);
			toast.error("Login Failed");
			setLoading(false);
		}
	};
	return (
		<>
			<h1
				className='jumbotron text-center bg-primary square'
				style={{ display: "grid" }}
			>
				Login
			</h1>
			<div className='container col-md-4 offset-md-4 pb-5'>
				<form onSubmit={handleSubmit}>
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
						onChange={e => setPassword(e.target.value)}
						placeholder='Enter Password'
						required
					/>
					<div className='d-grid gap-2'>
						<button
							type='submit'
							className='btn btn-block btn-primary'
							disabled={!email || !password || loading}
						>
							{loading ? <SyncOutlined spin /> : "Submit"}
						</button>
					</div>
				</form>
				<p className='text-center pt-3'>
					No Account?
					<Link href='/register'>
						<a>Register</a>
					</Link>
				</p>

				<p className='text-center'>
					<Link href='/forgot-password'>
						<a className='text-danger'>Forgot Password</a>
					</Link>
				</p>
			</div>
		</>
	);
};

export default Login;
