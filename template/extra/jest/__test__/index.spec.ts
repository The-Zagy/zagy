import {add} from '../add';

describe('test jest', () => {
	const add = (x: number, y: number) => x + y;
	test('test add function', () => {
		expect(add(1, 2)).toBe(3);
	});
});

describe('import add', () => {
	test('test add function', () => {
		expect(add(1, 2)).toBe(3);
	});
});
