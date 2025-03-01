const About = () => {
  return (
    <div className="flex items-center justify-center h-screen text-center p-4">
      <div className="max-w-2xl text-justify">
        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-4">About This Project</h1>
        <p className="text-[#1C1C84]">
          Hello there! This website was created by Kaushik Salsingikar. It was built to 
          solve the problem that not a lot of tourism websites focus on: Budgeting. 
          Traveling can be expensive and overwhelming, especially when trying to find 
          affordable flights and plan a budget-friendly itinerary. I built this website 
          to simplify the process by providing AI-powered destination suggestions, 
          real-time flight cost estimates, and a way to store itineraries—all in one place. 
          By combining Next.js, Firebase, and APIs, this project helps users explore new 
          places without breaking the bank. My goal is to make travel planning accessible, 
          efficient, and cost-effective for everyone.
        </p>
      </div>
    </div>

  )
}

export default About