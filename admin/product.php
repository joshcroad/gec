<!-- BEGIN #products -->
<div id="edit-product">
    <h2>Edit Product</h2>
    
    <section id="fields">
        <input type="text" id="single-title" placeholder="Title *" />
        <div id="title-message"></div>
        <textarea id="single-content" placeholder="Product Description *"></textarea>
        <div id="content-message"></div>
        <input type="text" id="single-price" placeholder="Price *" required />
        <div id="price-message"></div>
        <input type="text" id="single-sale" placeholder="Sale Price" />
        <div id="sale-message"></div>
        <input type="text" id="single-colour" placeholder="Colour" />

        <!-- Thumbnail upload
        <input type="text" id="single-thumbnail" placeholder="Thumbnail" />
        <a href="" id="update_image">Choose image</a>
        -->

        <div class="single-products">
            <div id="values-and-stocks"></div>
            <a href="" id="add-value-stock">+ <em>more values</em></a>
            <div id="stock-message"></div>
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