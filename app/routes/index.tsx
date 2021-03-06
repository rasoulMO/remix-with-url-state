import {faker} from "@faker-js/faker";
import {ChevronDownIcon} from "@heroicons/react/solid";
import {Link, useSearchParams} from "@remix-run/react";

type Person = {
	name: string;
	title: string;
	email: string;
	role: string;
};

faker.seed(123);

let people = faker.datatype.array(20).map(() => {
	let firstName = faker.name.firstName();
	let lastName = faker.name.lastName();
	let name = `${firstName} ${lastName}`;
	let email = faker.internet.email(firstName, lastName).toLowerCase();

	return {
		name,
		title: faker.name.jobTitle(),
		email,
		role: faker.name.jobType(),
	};
});

export default function Index() {
	let [searchParams] = useSearchParams();
	let [sortProp, desc] = searchParams.get("sort")?.split(":") ?? [];
	let sortedPeople = [...people].sort((a, b) => {
		return desc
			? b[sortProp]?.localeCompare(a[sortProp])
			: a[sortProp]?.localeCompare(b[sortProp]);
	});

	return (
		<div className='max-w-6xl py-8 mx-auto lg:py-16 '>
			<div className='px-4 sm:px-6 lg:px-8'>
				<div className='sm:flex sm:items-center'>
					<div className='sm:flex-auto'>
						<h1 className='text-xl font-semibold text-gray-900'>
							Users
						</h1>
						<p className='mt-2 text-sm text-gray-700'>
							A list of all the users in your account including
							their name, title, email and role.
						</p>
					</div>
				</div>
				<div className='flex flex-col mt-8'>
					<div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
							<div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
								<table className='min-w-full divide-y divide-gray-300'>
									<thead className='bg-gray-50'>
										<tr>
											<SortableColumn propName='name'>
												Name
											</SortableColumn>
											<SortableColumn propName='title'>
												Title
											</SortableColumn>
											<SortableColumn propName='email'>
												Email
											</SortableColumn>
											<SortableColumn propName='role'>
												Role
											</SortableColumn>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{sortedPeople.map((person: Person) => (
											<tr key={person.email}>
												<td className='py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6'>
													{person.name}
												</td>
												<td className='px-3 py-4 text-sm text-gray-500 whitespace-nowrap'>
													{person.title}
												</td>
												<td className='px-3 py-4 text-sm text-gray-500 whitespace-nowrap'>
													{person.email}
												</td>
												<td className='px-3 py-4 text-sm text-gray-500 whitespace-nowrap'>
													{person.role}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function SortableColumn({propName, children}: any) {
	let [searchParams] = useSearchParams();
	let [sortProp, desc] = searchParams.get("sort")?.split(":") ?? [];
	let newSort = null;

	if (sortProp !== propName) {
		newSort = propName;
	} else if (sortProp === propName && !desc) {
		newSort = `${propName}:desc`;
	}

	let newSearchParams = new URLSearchParams({sort: newSort});

	return (
		<th
			scope='col'
			className='py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6'
		>
			<Link
				to={newSort ? `/?${newSearchParams}` : "/"}
				className='inline-flex font-semibold group'
			>
				{children}
				<span
					className={`${
						sortProp === propName
							? "text-gray-900 bg-gray-200 group-hover:bg-gray-300"
							: "invisible text-gray-400 group-hover:visible"
					} flex-none ml-2 rounded`}
				>
					<ChevronDownIcon
						className={`${desc ? "rotate-180" : ""} w-5 h-5`}
						aria-hidden='true'
					/>
				</span>
			</Link>
		</th>
	);
}
