function changeSize() {
  let height = window.innerHeight.toString().concat('px')
  document.getElementById('background').style.height = height
  document.getElementById('blog').style.height = (window.innerHeight + 60) + 'px'
  document.getElementById('project').style.height = height
  document.getElementById('about').style.height = height
  $('#nav').width($('#container').width())
}
window.onresize = changeSize
changeSize()

$.get('https://blog.zhenly.cn/atom.xml', data => {
  let frag = document.createDocumentFragment();
  let count = 0
  for (let article of data.getElementsByTagName('entry')) {
    let node = document.createElement('a')
    node.innerHTML = article.getElementsByTagName('title')[0].textContent
    node.href = article.getElementsByTagName('id')[0].textContent
    node.target = '_blank'
    frag.appendChild(node)
    count++
    if (count === 8) break;
  }
  document.getElementById('blogContent').appendChild(frag)
})


document.getElementById('container').onscroll = e => {
  if ($('#about').offset().top < 50) {
    setNav(3)

  } else if ($('#project').offset().top < 50) {
    setNav(2)

  } else if ($('#blog').offset().top < 50) {
    document.getElementsByClassName('mon-3')[0].style.opacity = 0
    document.getElementById('nav').className = 'nav nav-fixed'
    setNav(1)
    $('#mon-6').css('left', '2%')
    $('#mon-7').css('right', '0%')
  } else {
    document.getElementsByClassName('mon-3')[0].style.opacity = 1
    document.getElementById('nav').className = 'nav'
    setNav(0)
    $('#toBlog').css('border-bottom', 'none')
    $('#mon-6').css('left', '12%')
    $('#mon-7').css('right', '10%')
  }
}

function setNav(index) {
  $('#toBlog').css('border-bottom', 'none')
  $('#toProject').css('border-bottom', 'none')
  $('#toAbout').css('border-bottom', 'none')
  switch (index) {
    case 1:
      $('#toBlog').css('border-bottom', '2px solid #fcfaf2')
      break
    case 2:
      $('#toProject').css('border-bottom', '2px solid #fcfaf2')
      break
    case 3:
      $('#toAbout').css('border-bottom', '2px solid #fcfaf2')
      break
    default:
      break
  }

}

$('#toBack').click(e => {
  $('#container').animate({
    scrollTop: $('#background').offset().top + $('#container').scrollTop()
  }, 500);
})

$('#toBlog').click(e => {
  $('#container').animate({
    scrollTop: $('#blog').offset().top + $('#container').scrollTop()
  }, 500);
})

$('#toProject').click(e => {
  $('#container').animate({
    scrollTop: $('#project').offset().top + $('#container').scrollTop()
  }, 500);
})

$('#toAbout').click(e => {
  $('#container').animate({
    scrollTop: $('#about').offset().top + $('#container').scrollTop()
  }, 500);
})
