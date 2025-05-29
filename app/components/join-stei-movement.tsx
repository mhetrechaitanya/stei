const JoinSTEIMovement = () => {
  return (
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 flex items-center">
      Join the
      {/* Direct inline rendering of "stei" in lowercase */}
      <span className="font-serif flex items-baseline inline-flex mx-1">
        <span className="text-black">s</span>
        <span className="text-black text-[1.25em] leading-none">t</span>
        <span className="text-black">e</span>
        <span className="text-[#900000]">i</span>
      </span>
      Movement
      <span className="ml-2 flex space-x-1">
        <span className="w-2 h-2 bg-black rounded-full"></span>
        <span className="w-2 h-2 bg-black rounded-full"></span>
        <span className="w-2 h-2 bg-black rounded-full"></span>
      </span>
    </h2>
  )
}

export default JoinSTEIMovement
