<!-- BEGIN #products -->
<div id="add-product">
    <h2>Add Product</h2>

    <section id="fields">
        <input type="text" id="single-title" placeholder="Title *" />
        <div id="title-message"></div>
        <textarea id="single-content" placeholder="Product Description"></textarea>
        <div id="content-message"></div>
        <input type="text" pattern="[0-9]+[.]?[0-9]?[0-9]?" id="single-price" placeholder="Price *" required />
        <div id="price-message"></div>
        <input type="text" pattern="[0-9]+[.]?[0-9]?[0-9]?" id="single-sale" placeholder="Sale Price" />
        <div id="sale-message"></div>
        <input type="text" id="single-colour" placeholder="Colour" />

        <!-- Thumbnail upload
        <input type="text" id="single-thumbnail" placeholder="Thumbnail" />
        <a href="" id="update_image">Choose image</a>
        -->

        <div class="single-products">
            <div id="values-and-stocks">
                <input type="text" class="single-values" placeholder="Value/Size" />
                <input type="text" class="single-stocks" placeholder="Stock" />
                <div id="stock-message"></div>
            </div>
            <a href="" id="add-value-stock">+ more values</a>
        </div>

        <select id="single-status">
            <option value="publish" selected>Publish</option>
            <option value="draft">Draft</option>
            <option value="trash">Trash</option>
        </select>

        <a href="product/" id="add-product-button">Add Product</a>
    </section>

</div>
<!-- END #products -->
