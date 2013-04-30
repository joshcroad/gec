<!-- BEGIN #products -->
<div id="edit-product">
    <h2>Edit Product</h2>
    
    <section id="fields">
        <input type="text" id="single-title" placeholder="* Product Name" />
        <textarea id="single-content" placeholder="* Product Description"></textarea>
        <input type="text" id="single-price" placeholder="* Price" required />
        <input type="text" id="single-sale" placeholder="Sale Price" />
        <input type="text" id="single-colour" placeholder="Colour" />

        <div class="thumbnail-container">
            <!-- For uploading a product thumbnail -->
            <input type="file" id="single-thumbnail" />
            <div id="single-thumbnail-preview"></div>
        </div>
        
        <div class="product-category">
            <h3>Pick a Category</h3>
            <ul id="single-category-list"></ul>
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
        <div id="values-and-stocks"></div>
        <a href="" id="add-value-stock">Add another size</a>
    </div>

</div>
<!-- END #products -->