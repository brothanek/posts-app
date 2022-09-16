import type { NextPage } from 'next'
import { FaReact, FaNodeJs } from 'react-icons/fa'
import { SiTypescript, SiMongodb, SiNextdotjs, SiTailwindcss, SiPassport } from 'react-icons/si'
import Layout from 'components/Layout'

const About: NextPage = () => {
	return (
		<Layout>
			<div className="flex flex-col items-center pt-4">
				<h1 className="text-4xl font-bold mb-10">About</h1>
				<h4 className="text-center ">Technologies used:</h4>

				<ul className="my-1 text-2xl text-center">
					<li className="flex items-center">
						<span className="mr-2">Next.js</span>
						<SiNextdotjs />
					</li>
					<li className="flex items-center">
						<span className="mr-2">React.js</span>
						<FaReact />
					</li>
					<li className="flex items-center">
						<span className="mr-2">TypeScript</span>
						<SiTypescript />
					</li>
					<li className="flex items-center">
						<span className="mr-2">Tailwindcss</span>
						<SiTailwindcss />
					</li>
					<li className="flex items-center">
						<span className="mr-2">Node.js</span>
						<FaNodeJs />
					</li>
					<li className="flex items-center">
						<span className="mr-2">MongoDB</span>
						<SiMongodb />
					</li>
					<li className="flex items-center">
						<span className="mr-2">PassportJS</span>
						<SiPassport />
					</li>

					<li>
						<a
							href="https://github.com/brothanek/fullstack-exercise#readme"
							className="text-base text-blue-500"
							target="_blank"
							rel="noreferrer"
						>
							and more...
						</a>
					</li>
				</ul>
				<div className="divider w-1/2 self-center" />
				<h4>
					GitHub{' '}
					<a
						href="https://github.com/brothanek/fullstack-exercise"
						className="text-blue-500"
						target="_blank"
						rel="noreferrer"
					>
						repo
					</a>
				</h4>

				<span className="mt-2">built by @brothanek</span>
			</div>
		</Layout>
	)
}

export default About
