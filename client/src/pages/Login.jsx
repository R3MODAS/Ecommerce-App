import Form from "../components/Form"

const Login = () => {
  return (
    <>
      <header className="w-full bg-grey-0 py-6 px-[6%] items-center">
        <p className="text-3xl font-bold text-primary-500 leading-6">Sociopedia</p>
      </header>

      <div className="login-container w-11/12 lg:w-1/2 bg-grey-0 p-8 my-8 mx-auto rounded-3xl">
          <h2 className="font-medium text-base leading-5 mb-6">Welcome to Sociopedia, the Social Media for Sociopaths!</h2>
          <Form />
      </div>
    </>
  )
}

export default Login