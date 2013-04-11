<!-- BEGIN #products -->
<div id="edit-product">
    <h2>Edit Product</h2>
    
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
            <div id="values-and-stocks"></div>
            <a href="" id="add-value-stock">+ <em>more values</em></a>
        </div>

        <select id="single-status">
            <option value="publish" selected>Publish</option>
            <option value="draft">Draft</option>
            <option value="trash">Trash</option>
        </select>
        <div id="date-posted"></div>
        <a href="" id="update-product-button">Update Product</a>
    </section>

</div>
<!-- END #products -->