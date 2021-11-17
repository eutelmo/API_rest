test('validar as principais operacoes do JEST', () => {
  let number = null;
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Validar operacao com objetos', () => {
  const obj = { name: 'Quimbe Alberto', mail: 'quimbereidelas@ipca.pt' };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'Quimbe Alberto');
  expect(obj.name).toBe('Quimbe Alberto');

  const obj2 = { name: 'Quimbe Alberto', mail: 'quimbereidelas@ipca.pt' };
  expect(obj).toEqual(obj2);
  expect(obj).toBe(obj);
});
