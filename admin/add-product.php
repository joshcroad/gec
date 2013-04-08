<!-- BEGIN #products -->
<div id="add-product">
    <h2 id="title">Add Product</h2>

    <section id="fields">
        <input type="text" id="single-title" placeholder="Title *" />
        <textarea id="single-content" placeholder="Product Description *"></textarea>
        <input type="text" pattern="[0-9]+[.]?[0-9]?[0-9]?" id="single-price" placeholder="Price *" required />
        <input type="text" pattern="[0-9]+[.]?[0-9]?[0-9]?" id="single-sale" placeholder="Sale Price" />
        <input type="text" id="single-colour" placeholder="Colour" />

        <!-- Thumbnail upload
        <input type="text" id="single-thumbnail" placeholder="Thumbnail" />
        <a href="" id="update_image">Choose image</a>
        -->

        <div class="single-products">
            <div id="values-and-stocks">
                <input type="text" class="single-values" placeholder="Value/Size" />
                <input type="text" class="single-stocks" placeholder="Stock" />
            </div>
            <a href="" id="add-value-stock">+ more values</a>
        </div>

        <select id="single-status">
            <option value="publish" selected>Publish</option>
            <option value="draft">Draft</option>
            <option value="trash">Trash</option>
        </select>

        <a href="" id="add-product-button">Add Product</a>
        <div id="message"></div>
    </section>

</div>
<!-- END #products -->
