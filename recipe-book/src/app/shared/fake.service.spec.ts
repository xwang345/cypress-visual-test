import { FakeService } from './fake.service';

describe('FakeService', () => {
	let service: FakeService;
	let httpClientSpy: any;

	beforeEach(() => {
		httpClientSpy = {
			get: jest.fn(),
		};
		service = new FakeService(httpClientSpy);
	});

	it('should be created', () => {
		expect(1).toBe(1);
	});

	it('should test getFakeData', () => {
		const res = 'Techopsworld';
		const url = 'https://jsonplaceholder.typicode.com/posts/1';
		jest.spyOn(httpClientSpy, 'get').mockReturnValue(res);
		service.getDataValue1();

		expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
		expect(httpClientSpy.get).toHaveBeenCalledWith(url);
	});
});
