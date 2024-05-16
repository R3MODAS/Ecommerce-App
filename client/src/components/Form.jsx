const Form = () => {
    return (
        <form>
            <div className="relative mb-7">
                <input type="email" id="email" className="block px-3 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-black/20 border-1 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-primary-500 peer focus:border-2" placeholder=""
                />
                <label htmlFor="email" className="absolute text-sm text-black/60 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-3 peer-focus:px-2 peer-focus:text-primary-500 peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email</label>
            </div>
            <div className="relative">
                <input type="password" id="password" className="block px-3 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-black/20 border-1 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-primary-500 peer focus:border-2" placeholder=""
                />
                <label htmlFor="password" className="absolute text-sm text-black/60 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-3 peer-focus:px-2 peer-focus:text-primary-500 peer-focus:font-medium peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
            </div>
        </form>
    )
}

export default Form