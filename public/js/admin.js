const deleteProduct = (btn) => {
  const prodid = btn.parentNode.querySelector("[name=productid]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productelement = btn.closest("article");

  fetch("/admin/product/" + prodid, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productelement.parentNode.removeChild(productelement);
    })
    .catch((err) => console.log(err));
};
