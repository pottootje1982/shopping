export class AhApi {
  constructor(
    private username: string,
    private password: string,
  ) {}

  login() {
    if (this.username === 'test_user' && this.password === 'test_pass') {
      return true;
    } else return false;
  }

  async addToShoppingList() {
    return { success: true };
  }
}
