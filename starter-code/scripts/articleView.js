// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.render = function() {
  articles.forEach(function(a) {
    $('#articles').append(a.toHtml('#article-template'));
    $('#author-filter').append(a.toHtml('#author-filter-template'));
    if($('#category-filter option:contains("'+ a.category + '")').length === 0) {
      $('#category-filter').append(a.toHtml('#category-filter-template'));
    };
  });
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });
  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// Highlights after clicking on field with json
articleView.initNewArticlePage = function() {
  $('#exportfield').hide();
  $('#article-json').on('focus', function() {
    $(this).select();
  });

  // Everytime new-form changes, create new article (passed in, function called by event handler --> callback)
  $('#new-form').on('change', articleView.create);
};

// "Live update" functionality
articleView.create = function () {
  // Clear out preview
  $('#article-preview').empty();


  // Create new article based on field data (pulled from dom)
  var formArticle = new Article({
    title: $('#article-title').val(),
    author: $('#articel-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    // 0 is falsy value --> use ternary operator
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });

  var newArticleHtml = formArticle.toHtml('#article-template');
  $('#article-preview').append(newArticleHtml);

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  $('#export-field').show();
  $('#article-preview').show();
  $('#article-json').val(JSON.stringify(formArticle));
};

articleView.initNewArticlePage();

articleView.render();
articleView.handleCategoryFilter();
articleView.handleAuthorFilter();
articleView.handleMainNav();
articleView.setTeasers();
