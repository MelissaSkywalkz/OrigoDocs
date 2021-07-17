var acc = document.getElementsByClassName("accordion");
 var i;

 for (i = 0; i < acc.length; i++) {
   acc[i].addEventListener("click", function() {
     this.classList.toggle("active");
     var panel = this.nextElementSibling;
     if (panel.style.maxHeight) {
       panel.style.maxHeight = null;
     } else {
       panel.style.maxHeight = panel.scrollHeight + "px";
     }
   });
 }

 var o =document.getElementById("one");
 var to =document.getElementById("two");
 var fo =document.getElementById("copyright");
 to.style.display = 'none';

 function closeNav() {
     document.getElementById("mySidenav").style.width = "0px";
     document.getElementById("main").style.marginLeft= "0px";
     o.style.display = '';
     to.style.display = 'none';
     fo.style.display = 'none';
     $("#one").hide();
     $("#two").show();
 }

 function openNav() {
     document.getElementById("mySidenav").style.width = "14rem";
     document.getElementById("main").style.marginLeft = "14rem";
     o.style.display = 'none';
     to.style.display = '';
     fo.style.display = '';
     $("#two").hide();
     $("#one").show();
 }

 if (window.matchMedia('(max-width: 694px)').matches) {
   closeNav();
 }
