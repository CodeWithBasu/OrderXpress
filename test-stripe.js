

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/create-checkout-session", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({items: [], cartTotal: 0, tax: 0, discountAmount: 0, grandTotal: 0})
    })
    const data = await res.json()
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}
test()
