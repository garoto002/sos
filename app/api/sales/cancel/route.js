export async function POST_CANCEL(request) {
    try {
      const body = await request.json();
  
      const cancelledSale = await Sale.findByIdAndDelete(body.saleId);
  
      // Reverter o estoque ao cancelar a venda
      for (const productSold of cancelledSale.products) {
        const product = await product.findById(productSold.product);
        if (product) {
          product.quantityInStock += productSold.quantity;
          await product.save();
        }
      }
  
      return NextResponse.json(cancelledSale, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { message: "Ocorreu um erro cancelando a venda" },
        { status: 500 }
      );
    }
  }
  