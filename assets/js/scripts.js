var tags = [];

function initPage(){
  // fetch portofolio.json file
  fetch('portofolio.json')
    .then(response => response.json())
    .then(data => {
      // process the JSON data
      for(var item of data) {
        // generate element
        var block = $('<div class="pw-portoblock"><h2></h2><div class="pw-portoitems"></div></div>');
        var blockYear = $('>h2',block);
        var portos = $('.pw-portoitems',block);
        blockYear.text(item.year);
        var imgs = '';
        var prj = item.projects;
        for(var p of prj) {
          var ptags = p.tags || [];
          var im = p.images || [];
          for(var t of ptags) {
            if((t.trim()!='')) {
              var tagIndex = tags.findIndex(tag => tag[0] === t);
              if(tagIndex === -1) tags.push([t,1]);
              else tags[tagIndex][1]++;
            }
          }
          var isOrnament = p.type == 'ornament';
          var frame = isOrnament? '': '<div class="pw-frames"><div class="pw-frame-a"></div><div class="pw-frame-b"></div><div class="pw-frame-c"></div></div>';
          for(var i of im) {
            var iact = isOrnament? '':' onclick="showDetails(this)"'
            var iimg = $('<div data-id="'+p.id+'" class="pw-img'+(isOrnament?' pw-ornament':'')+' w-'+i.rWidth+' h-'+i.rHeight+'" data-tags="'+(ptags.join(','))+'" '+iact+'>'+frame+'<img loading="lazy" class="" src="assets/images/projects/'+i.path+'" alt="'+p.title+'" style="'+(i.style || '')+'"></div>');
            iimg.data('project',p);
            portos.append(iimg);
            break;
          }
        }


        // append to the container
        $('.pw-portolist').append(block);
      }
      // sort tags
      tags.sort((a, b) => b[1] - a[1]);
      // generate tags
      var tagList = $('.pw-hashes');
      tagList.empty();
      tagList.append('<div class="pw-tag-toggles" data-state="on" title="Toggle select/unselect all categories" onclick="pwTagToggle(this)"><span><img src="assets/images/chk-all.png" width="12"></span></div>');

      var cloudList = $('.pw-wordcloud');
      for(var t of tags) {
        // t[1] is occurences. define font size based on occurences
        var size = 'XS'; // default size
        if(t[1] >= 100) size = 'XXL';
        else if(t[1] >= 50) size = 'XL';
        else if(t[1] >= 30) size = 'L';
        else if(t[1] >= 10) size = 'M';
        else if(t[1] >= 2) size = 'S';

        tagList.append('<label class="pw-tag" title="Show/hide all items with category: '+t[0]+'"><input type="checkbox" checked value="'+t[0]+'" onclick="pwTagShow()"><span>'+t[0]+' ('+t[1]+')</span></label>');
        //cloudList.append('<span class="pw-cloud-item '+size+'" data-tag="'+t[0]+'" data-count="'+t[1]+'">'+t[0]+'</span>');
      }

    })
    .catch(error => {
      console.error('Error fetching portofolio.json:', error);
    });
}

var _pwCurrentProject = null;
function closeDetail(){
  var popwin = $('.pw-popwindow');
  if (popwin.length>0) popwin.remove();
  _pwCurrentProject = null;
}

function showDetails(el){
  _pwCurrentProject = $(el);
  var popwin = $('.pw-popwindow');
  if (popwin.length>0) popwin.remove();
  popwin = $('<div class="pw-popwindow"><div class="pw-popinner"><div class="pw-frames"><div class="pw-frame-a"></div><div class="pw-frame-b"></div><div class="pw-frame-c"></div></div>'+
    '<a href="#" class="pw-popwindow-close" onclick="closeDetail()">&#10005;</a>'+
    '<div class="pw-popimages">'+
      '<div class="owl-carousel owl-theme">'+
      '</div>'+
    '</div>'+
    '<div class="pw-popinfo"></div></div></div>');
  var project = $(el).data('project');
  var prjYear = project.id.split('-')?.[1] || '-';
  var imgCtr=0;
  for(var img of project.images) {
    $('.pw-popimages .owl-carousel', popwin).append(
      '<img src="assets/images/projects/'+img.path+'" width="'+img.width+'" height="'+img.height+'" alt="">'
    );
  }
  $('.pw-popinfo', popwin).append(
    '<div class="pw-project-pager"><a href="#" onclick="pwProjectNav(\'prev\');return false;">Newer Project</a><a href="#" onclick="pwProjectNav(\'next\');return false;">Older Project</a></div>'+
    '<h3>'+project.title+'</h3>'+
    '<div class="item"><div class="lbl">Year</div><div class="val">'+prjYear+'</div></div>'+
    '<div class="item"><div class="lbl">Type</div><div class="val">'+project.type+'</div></div>'+
    (project.link ? '<div class="item"><div class="lbl">Link</div><div class="val"><a href="'+project.link+'" target="_blank" >View Site <img alt="open" src="assets/images/icon-open-link.png"></a><div class="vnote"><b>Note :</b> This project was developed and hosted externally based on the client\'s discretion. The availability of the live link may vary over time depending on their hosting preferences. If the link is inactive, please refer to the screenshots or contact me directly for more details.</div></div></div>' : '' )+
    '<div class="item"><div class="lbl">Tags</div><div class="val">'+(project.tags.join(', ') || '-')+'</div></div>'
  );
  $('body').append(popwin);
  $('.owl-carousel').owlCarousel({
      loop:true,
      margin:0,
      nav:true,
      items:1,
      dots:true
  })
}

function pwProjectNav(direction) {
  if (!_pwCurrentProject) return;
  var target = direction === 'next' ? _pwCurrentProject.nextAll(':not(.pw-ornament)').first() : _pwCurrentProject.prevAll(':not(.pw-ornament)').first();
  if (target.length > 0) {
    showDetails(target[0]);
  } else {
    var parentBlock = _pwCurrentProject.closest('.pw-portoblock');
    var siblingBlock = direction === 'next' ? parentBlock.next('.pw-portoblock') : parentBlock.prev('.pw-portoblock');
    if (siblingBlock.length > 0) {
      showDetails(siblingBlock.find('.pw-img:not(.pw-ornament)').first());
    }
  }
}

function pwTagToggle(el) {
  var isOn = $(el).attr('data-state') === 'on';
  if(isOn) {
    $(el).attr('data-state', 'off');
     $('.pw-tag input').prop('checked', false);
  } else {
    $(el).attr('data-state', 'on');
     $('.pw-tag input').prop('checked', true);
  }
  pwTagShow()
}

function pwTagShow(){
  var tags = $('.pw-tag input:checked').map(function() {
    return this.value;
  }).get();
  $('.pw-portoblock').show();
  var allChecked = $('.pw-tag input:checked').length === $('.pw-tag input').length;
  if (allChecked) {
    $('.pw-img').show();
  } else {
    $('.pw-img').hide();
    if(tags.length > 0) {
      for(var t of tags) {
        $('.pw-img[data-tags*="'+t+'"]').show();
      }
    }
  }
  // hide pw-portoblock when no images are shown
  $('.pw-portoblock').each(function() {
    var visibleImages = $(this).find('.pw-img:visible').length;
    if (visibleImages === 0) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });

}

$(()=>{
    initPage();
});
