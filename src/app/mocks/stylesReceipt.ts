export const docStyles = `<style type="text/css">
h1{
  font-size: 1.5em;
  color: #222;
}
h2{font-size: .9em;}
h3{
  font-size: 1.2em;
  font-weight: 300;
  line-height: 2em;
}
p{
  font-size: .7em;
  color: #666;
  line-height: 1.2em;
}
#top, #mid,#bot{ /* Targets all id with 'col-' */
  border-bottom: 1px solid #EEE;
}

#top{min-height: 100px;}
#mid{min-height: 60px;}
#bot{ min-height: 50px;}

#top .logo{
  //float: left;
  height: 60px;
  width: 60px;
  background: url(../../assets/img/receiptLogo.png)
  background-size: 60px 60px;
}
.info{
  display: block;
  //float:left;
  margin-left: 0;
}
.title{
  float: right;
}
.title p{text-align: right;}
table{
  width: 100%;
  border-collapse: collapse;
}
td{
  //padding: 5px 0 5px 15px;
  //border: 1px solid #EEE
}
.tabletitle{
  //padding: 5px;
  font-size: .5em;
  background: #EEE;
}
.linedetails{border-bottom: 1px solid #EEE;}
.number{width: 15mm;}
.item{width: 24mm;}
.itemtext{font-size: .5em;}
#legalcopy{
  margin-top: 5mm;
}
}</style>`;
