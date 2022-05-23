export function numberingDatatable(data, page, per_page) {
    const offset = page == 1 ? 1 : per_page * (page - 1) + 1;
  
    return data.map((item, index) => {
      return { ...item, number: index + offset };
    });
  }
  