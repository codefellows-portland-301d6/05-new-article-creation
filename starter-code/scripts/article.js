var articles = [];

function Article (opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  };
}

Article.prototype.toHtml = function(scriptTemplateId) {
  var renderTemplate = Handlebars.compile($(scriptTemplateId).html());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  if(this.daysAgo < 1) {
    this.publishStatus = '(published today)';
  } else {
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  }
  // TODO: Parse any markdown with marked!
  this.body = marked(this.body);

  return renderTemplate(this);
};

ourLocalData.sort(function(a,b) {
  return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});

ourLocalData.forEach(function(ele) {
  articles.push(new Article(ele));
});
