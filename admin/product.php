<!-- BEGIN #products -->
<div id="edit-product">
    <h2>Edit Product</h2>
    
    <section id="fields">
        <input type="text" id="single-title" placeholder="* Product Name" />
        <div id="title-message"></div>
        <textarea id="single-content" placeholder="* Product Description"></textarea>
        <div id="content-message"></div>
        <input type="text" id="single-price" placeholder="* Price" required />
        <div id="price-message"></div>
        <input type="text" id="single-sale" placeholder="Sale Price" />
        <div id="sale-message"></div>
        <input type="text" id="single-colour" placeholder="Colour" />
    </section>

    <!-- Thumbnail upload
    <input type="text" id="single-thumbnail" placeholder="Thumbnail" />
    <a href="" id="update_image">Choose image</a>
    -->
        <div class="product-category">
            <h3>Pick a Category</h3>
            <ul id="single-category-list"></ul>
            <div id="category-message"></div>
        </div>
    </section>

    <div class="single-product-options">
        <select id="single-status">
            <option value="publish" selected>Publish</option>
            <option value="draft">Draft</option>
            <option value="trash">Trash</option>
        </select>
        <a href="" id="update-product-button">Update Product</a>
        <div id="date-posted"></div>
    </div>

    <div class="single-products">
        <div id="values-and-stocks">
            <div id="stock-message"></div>
        </div>
        <a href="" id="add-value-stock">Add another size</a>
    </div>

</div>
<!-- END #products -->