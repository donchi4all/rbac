import * as Models from '../../models';

// TEMPORARY class
export default class Test {
  public addTestValueToGrantTable (): void {
    const grantTable = new Models.Grant({
      title: 'test_grant_title_2',
      slug: 'grant_2',
      active: false,
    });
    grantTable.save();

    console.log('Grant Table: ', grantTable);
  }
}
