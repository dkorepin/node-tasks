import { v4 } from 'uuid';

const usersList = [
	{
		id: 'f76db0a5-c8b2-4cf9-b1e3-f86a8d2ea8cf',
		login: 'JamieNorman',
		password: '4dfTj*Er',
		age: 34,
		isDeleted: false,
	},
	{
		id: 'a96db0a5-c8b2-4cf9-b1e3-f86a8d2ea8cc',
		login: 'AlexCagel',
		password: 'l68gg!op',
		age: 29,
		isDeleted: false,
	},
	{
		id: '1b00207a-93dc-4e47-9eac-0c4cb165db31',
		login: 'BorisEltsin',
		password: '7@iudT4j',
		age: 70,
		isDeleted: false,
	}
];

class UsersService {
	#storage;

	constructor(initialDB) {
		this.#storage = new Map();
		initialDB.forEach((user) => this.#storage.set(user.id, user));
	}

	addNewUser = (fields) => {
		const newUser = this.#makeNewUserByBody(fields);
		this.#storage.set(newUser.id, newUser);

		return newUser;
	};

	updateUser = (user, fields) => {
		const updatedUser = {
			...user,
			...fields,
			id: user.id,
			isDeleted: false,
		};
		this.#storage.set(updatedUser.id, updatedUser);

		return updatedUser;
	};

	getUserById = (id) => {
		const user = this.#storage.get(id);

		return user?.isDeleted ? undefined : user;
	};

	removeUser = (user) => {
		const updatedUser = { ...user, isDeleted: true };
		this.#storage.set(updatedUser.id, updatedUser);
	};

	getFilteredUsers = (search, limit) => {
		return this.#getUsersList()
			.filter(({ isDeleted, login }) => {
				if (isDeleted) return false;

				return search.length > 0 ? login.toLowerCase().includes(String(search).toLowerCase()) : true;
			})
			.sort((aUser, bUser) => {
				if (aUser.login < bUser.login) return -1;
				if (aUser.login > bUser.login) return 1;
				return 0;
			}).slice(0, limit.length > 0  ? Number(limit) : 100);
	};

	#getUsersList = () => Array.from(this.#storage.values());

	#makeNewUserByBody = (body) => ({
		id: v4(),
		login: body.login,
		password: body.password,
		age: body.age,
		isDeleted: false,
	});
}

export default new UsersService(usersList);