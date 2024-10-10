export const sortArrayByKey = (sections: Array<Record<string, any>>, comparaisonKey: string) => sections.sort((a: any, b: any) => {
  // Move archived sections to the end
  if (a[comparaisonKey] && !b[comparaisonKey]) {
    return 1;
  } else if (!a[comparaisonKey] && b[comparaisonKey]) {
    return -1;
  }
  return 0;
});
