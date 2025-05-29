import RotatingLogo from "../components/rotating-logo"
import RotatingLogoSvg from "../components/rotating-logo-svg"

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">STEI Rotating Logo</h1>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Canvas Version</h2>
          <RotatingLogo />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">SVG Version</h2>
          <RotatingLogoSvg />
        </div>
      </div>

      <div className="max-w-md text-center mt-12">
        <p className="text-lg">
          This rotating logo represents STEI's mission of empowering individuals through continuous growth and
          development.
        </p>
      </div>
    </div>
  )
}
