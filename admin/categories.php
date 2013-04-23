<!-- BEGIN #categories -->
<div id="categories">
    <h2>Category Management</h2>

    <section id="cat-fields">
        <h3>Add Category</h3>
        <input type="text" id="cat-name" placeholder="* Category Name" />
        <div id="cat-name-message"></div>
        <input type="text" id="cat-menu-order" placeholder="* Menu Order" />
        <div class="clearfix">
            <div id="cat-menu-order-message"></div>
            <select id="cat-status">
                <option value="publish" selected>Publish</option>
                <option value="draft">Draft</option>
                <option value="trash">Trash</option>
            </select>
        </div>
        <p class="note"><em>Note. Setting -1 removes it from the menu</em></p>
        <a href="" id="add-cat-button">Add Category</a>
    </section>

    <section class="current-cats">
        <div class="filter">
            FILTER BY: 
            <a href="categories/filter=publish" class="filter-table">PUBLISH</a> /
            <a href="categories/filter=draft" class="filter-table">DRAFT</a> / 
            <a href="categories/filter=trash" class="filter-table">TRASH</a>
        </div>
        <ul id="category-list"></ul>
    </section>

</div>
<!-- END #categories -->
