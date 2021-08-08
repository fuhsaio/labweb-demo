// 根據 Id 取得 該資源的連結
function getLink (Id,data){
    try {
        Str = ""
        var rs = data.filter(x=> x.Id == Id)[0].resource
        $.each(rs, function(i){
            Str+= '<a class="res-btn2" href="'+ rs[i].link +'" target="_blank">'+ rs[i].name +'</a>'
        })     
    } 
    catch (error) {
        Str = "取得資料有誤，請聯絡管理人"
    }
    finally{
        return Str 
    }  
}

// 取得  Resource_link 資料
// 根據 .modal-link 生成對應 Modal
function load_otherResource(){
    $.ajax({
        url: "data/Resource_link.json",
        dataType: 'json'
        }).done(function(data){

        // 其他技術資源跳窗
        $(".modal-link").each(function(){              
            var title = $(this).find("h5").text()

            // 依按鈕 生成對應跳窗
            $(this).find("a").each(function() {
                var btnName = $(this).text()
                var target = title + '－' + btnName
                $(this).attr("data-bs-toggle","modal")
                $(this).attr("data-bs-target","#"+ target)
                $(this).after( '<div class="modal fade " id="'+ target +'" tabindex="-1"> \
                                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"> \
                                        <div class="modal-content shadow-lg"> \
                                            <div class="modal-header" style="background-color: #04c4c2;" > \
                                                <h5 class="modal-title text-light">'+ target +'</h5> \
                                                <button type="button" class="btn-close btn-close-white"  data-bs-dismiss="modal" aria-label="Close"></button> \
                                            </div> \
                                            <div class="modal-body">'
                                                + getLink(this.id,data) +
                                            '</div> \
                                        </div> \
                                    </div> \
                                </div>')
            })
        })
    })
}

// 根據 Id 取得 此類別的論文
function getPaper(Id,data){
    try {
        var accordion = Id +'-accordion'
        var Str = '<div class="accordion accordion-flush" id="'+ accordion +'">';           
        var rs = data.filter(x=> x.Id == Id)[0].paper
        
        // 依年度 生成對應 accordion-collapse
        $.each(rs, function(i){
            Str+='  <div class="accordion-item"> \
                        <h2 class="accordion-header"> \
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-'+ Id + rs[i].Year +'">'
                                + rs[i].Year +
                            '</button> \
                        </h2> \
                        <div id="collapse-'+ Id + rs[i].Year +'" class="accordion-collapse collapse" data-bs-parent="#'+ accordion +'"> \
                            <div class="accordion-body"> \
                                <ul class="list-group list-group-flush">'   

            // 取得 該年論文
            var t = rs[i].title
            $.each(t, function(j){
                Str+='<li class="list-group-item" style="color:#444444">'+ t[j] +'</li>'
            })   

            Str+= '</ul></div></div>'

        })    
    } 
    catch (error) {
        Str="取得資料有誤，請聯絡管理人"
    }
    finally { 
        return Str
    }
}

// 取得 Research_result 資料
// 根據 .modal-collapse 生成對應 Modal
function load_researchResource(){

    $.ajax({url: "data/Research_result.json",
            dataType: 'json'
        }).done(function(data){
            $(".modal-collapse").each(function(){              
            var prof = $(this).find("h5").text()

                // 依按鈕 生成對應跳窗
                $(this).find("a").each(function(){
                    var btnName = $(this).text()
                    var target = prof + '－' + btnName
                    $(this).attr("data-bs-toggle","modal")
                    $(this).attr("data-bs-target","#"+ target)
                    $(this).after( '<div class="modal fade " id="'+ target +'" tabindex="-1"> \
                                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"> \
                                            <div class="modal-content shadow-lg"> \
                                                <div class="modal-header" style="background-color: #04c4c2;" > \
                                                    <h5 class="modal-title text-light">'+ target +'</h5> \
                                                    <button type="button" class="btn-close btn-close-white"  data-bs-dismiss="modal" aria-label="Close"></button> \
                                                </div> \
                                                <div class="modal-body" style="padding:0px">'
                                                    + getPaper(this.id,data)+
                                                '</div> \
                                            </div> \
                                        </div> \
                                    </div>')
                })
            })
        })
}


// 點擊 複製信箱地址
function copyMail(e) {
    var copyText = $(e).find("a").text()
    var elem = document.createElement("textarea")
    document.body.appendChild(elem)
    elem.value = copyText
    elem.select()
    document.execCommand("copy")
    document.body.removeChild(elem)
    alert("Email address copied to clipboard")    
}

// 增加 成員信箱
function memberMail(mail,auth){
    if(!auth){
        return ""
    }
    return '<div class="card-footer text-center text-muted" \
            style="cursor:pointer" onClick="copyMail(this)">\
            <img src="assets/mail.svg">\
            Send<a style="display:none">'+mail+'</a></div>'
}

// 匯入 成員資料 ( memberCard )
function load_memberData(auth){
    $.ajax({
        dataType:"json",
        url:"data/Lab_member.json",
        success:function(result)
        {                
            var ms = result.data
            ms.reverse();
            $.each(ms, function(i,value) {
                var m = ms[i]
                var card_data= '<div class="col-lg-3 col-md-4 col-6"> \
                                <div class="card mt-4"> \
                                    <div class="card-body px-1"> \
                                        <h5>'+m[0]+'</h5> \
                                        <label class="line"></label> \
                                        <p class="mb-2">系級 '+m[1]+'</p> \
                                        <p class="mb-2">'+m[2]+'</p> \
                                        <p class="mb-2 d-none d-sm-block">英文名 '+m[3]+'</p> \
                                        <p class="mb-0">專長 '+m[4]+'</p> \
                                    </div> \
                                    '+ memberMail(m[5],auth)+'\
                                </div> \
                            </div>';
                if(m.length>4){
                    $('#load_memData').prepend(card_data)
                }    
            })
        }
    })
}

// 匯入 畢業成員資料 ( searchTable )
function load_searchTable(){
    $('#searchtable').DataTable({
        "order": [[1, 'desc']],
        "pageLength": 5,
        "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]], 
        "ajax":"data/Graduate_member.json",
        scrollY:'50vh',
        scrollCollapse: true,
        responsive: {
            details: {
                renderer: function ( api, rowIdx ) {
                    // Select hidden columns for the given row
                    var data = api.cells( rowIdx, ':hidden' ).eq(0).map( function ( cell ) {
                        var header = $( api.column( cell.column ).header() );
                        return '<tr>'+
                                '<td style="padding:0px">'+
                                    header.text()+':'+
                                '</td> '+
                                '<td style="white-space:normal">'+
                                    api.cell( cell ).data()+
                                '</td>'+
                            '</tr>';
                    } ).toArray().join('');
                    return data ?
                        $('<table/>').append( data ) :
                        false;
                }
            }
        }
    })
}
    


$(document).ready(function(){

    load_memberData()

    load_researchResource()

    load_otherResource()

    $( "#SearchMemberModal" ).one( "shown.bs.modal", function() {
        load_searchTable();
    });

    // 初始化 燈箱插件 ( 實驗室環境圖片)
    $('#env-gallery').magnificPopup({
        delegate: 'a', // the selector for gallery item
        type: 'image',
        gallery: {
        enabled:true
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function(item) {
                return item.el.attr('title') + '<small></small>';
            }
        }      
    });

    // 初始化 輪播插件 ( 活動相片 )
    phSlideShow.slideshowInit(
        ".slideshow", 	//element
        5000, 			//speed
        true, 			//show controls
        true			//show captions (html title tag)
    );

    // 登入
    $( "#loginForm" ).on( "submit", function(e) {
        e.preventDefault();
        var a = $(this).find('input[name="account"]').val()
        var p = $(this).find('input[name="password"]').val()

        if(a =="test" && p=="123"){
            $('#LoginModal').modal('hide')
            $("#loginMenu").hide()
            $("#logoutMenu").show()
        
            // reload member data
            $("#load_memData").children(":not(#SearchMemberCard)").remove()
            load_memberData("auth")
    
            // reload searchtable data
            if($.fn.DataTable.isDataTable( '#searchtable' )){
                debugger
                $('#searchtable').dataTable().fnClearTable();
                $("#searchtable").DataTable().destroy();          
                $( "#SearchMemberModal" ).one( "shown.bs.modal", function() {
                    load_searchTable()
                })
            }

            $("#searchtable thead tr").append("<th>信箱</th>")
            setTimeout(function () { alert("Login Success") }, 300)
        }
        else{
            alert("Account or Password Incorrect")
        }
    })
})
