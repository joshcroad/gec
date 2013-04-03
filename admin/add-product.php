<!-- BEGIN #products -->
<div id="add-product">
    <h2 id="title">Add Product</h2>

    <section id="fields">
        <input type="text" id="single-title" placeholder="Title" />
        <textarea id="single-desc" placeholder="Product Description"></textarea>
        <input type="text" pattern="[0-9]+[.]?[0-9]?[0-9]?" id="single-price" placeholder="Price" required />
        <input type="text" pattern="[0-9]+[.]?[0-9]?[0-9]?" id="single-reduced" placeholder="Reduced Price" />
        <input type="text" id="single-stock" placeholder="Stock" />
        <select id="single-status">
            <option value="publish" selected>Publish</option>
            <option value="draft">Draft</option>
        </select>
        <div id="date-posted"></div>
        <a href="">Add Product</a>
        <div id="message"></div>
    </section>

</div>
<!-- END #products -->
