let total_data;
let affected_data;
let drug_data = [];
let drug_age_data = [];
let drug_name;
let hover_position_x = [];
let hover_position_y = [];
let hover_diameter = [];
let drugArrays = []; // 3-dimentional array for plotting venn diagram
let  drugAgeArray = [];
let age_chart_state = -1;
let drawCrosses = false
let main_toggle_state = 0;
let v3_toggle_state = 0;
let drug;
let drug_users;
let drug_addicts;
let addicted_to_total;

let canvasWidth = 1450;
let canvasHeight = 1000;
let total_circle_scaling = 6;
let rect_scaling = 0.5;

// Position
let total_n_addicted_circle_position = [600, 835, 490, 728, 965];
let total_n_addicted_y_position = 255;
let drug_name_position = 570;
let age_legend_rect_position = [400,540,680,820,960];
let age_chart_rectangle_position = [200+400, 400+150, 400, 50]
let main_toggle_x_position = [150,300,450]
let main_toggle_y_position = 110;
let v2_toggle_x_position = 200;
let v2_toggle_y_position = 200;
let category_venn_position = 600;
let category_venn_y_position = 700;
let v3_toggle_x_position = 260;
let v3_toggle_y_position = 230;
let drug_toggle_offset = 130;
let v3_drug_venn_x_position = 350
let v3_drug_venn_y_position = 400
let v1_bar_chart_x_position = 400
let v1_bar_chart_y_position = 180
let v1_drug_name_x_scaling = [70,60,53,90,120]
let v1_pie_x_position = 600
let v1_pie_y_position = 680
let v1_pie_data_x_position = [-60,70,80,10,-60]
let v1_pie_data_y_position = [-70,-70,30,70,30]


// Color
let age_chart_color = ['hsba(190, 100%, 50%,1)', 'hsba(190, 100%, 50%,0.65)', 'hsba(190, 100%, 50%,0.35)', 'hsba(190, 100%, 50%,0.05)']
let v2_venn_chart_color = ['hsba(210, 20%, 100%,0.5)', 'hsba(100, 20%, 100%,0.5)', 'hsba(400, 20%, 100%,0.5)']

let age_chart_category = ['Criminal', 'Mentally ill', 'Unemployed']
let age_below_chart_category = ['Affected users', 'Addicted users', 'Total users']
let age_legend = ['18-25 years', '26-34 years','35-49 years', '50+ years']


let drugCategoryFileNames = ['marijuana_category.csv', 'cocaine_category.csv', 'heroin_category.csv', 'hallucinogen_category.csv', 'methamphetamine_category.csv']
let drugAgeFileNames = ['marijuana_age.csv', 'cocaine_age.csv', 'heroin_age.csv', 'hallucinogen_age.csv', 'methamphetamine_age.csv']
function preload() {
  total_data = loadTable('data/real_data.csv','csv','header')

  affected_data = loadTable('data/ellipse_data.csv', 'csv', 'header')

  total_age_data = loadTable('data/total_age_data.csv', 'csv', 'header')

  for(let drug=0;  drug<=4;drug++){
    drug_data[drug] = loadTable('data/'+drugCategoryFileNames[drug], 'csv', 'header')
  }

  for(let drug=0;  drug<=4;drug++){
    drug_age_data[drug] = loadTable('data/'+drugAgeFileNames[drug], 'csv', 'header')
  }
}


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  textSize(14);
  frameRate(60);
  textFont('serif');

  for(let drug=0;drug<=4;drug++) {
      drugArrays[drug] = [];
      for(let cat=0;cat<=2;cat++){
        drugArrays[drug][cat]=[]
        for(let age=0;age<=3;age++) {
          drugArrays[drug][cat][age] = drug_data[drug].get(cat, age+1)
        }
      }
  }
  for(let drug=0;drug<=4;drug++) {
      drugAgeArray[drug] = [];
      for(let cat=0;cat<=2;cat++){
        drugAgeArray[drug][cat]=[]
        for(let age=0;age<=3;age++) {
          drugAgeArray[drug][cat][age] = drug_age_data[drug].get(cat, age+1)/100
        }
      }
  }
}

function draw() {
  background('#FFFAFA');

  fill(0)
  line(100,0,100,canvasHeight);
  line(canvasWidth-100,0,canvasWidth-100,canvasHeight);
  textSize(30)
  text('Drug Addiction Statistics in the US for 2017', 120, 50)
  textSize(15)
  text('Some random explanatory text', 120, 80)
  line(110,90,canvasWidth-110,90)

  let k1 = color(180)//fill(180)

  for(let i=0; i<=2;i++){
    if(main_toggle_state!=i){
      k1.setAlpha(200)
    }
    else{
      k1.setAlpha(10) 
    }
    fill(k1)
    rect(main_toggle_x_position[i], main_toggle_y_position, 150, 40)
  }
  fill(0)
  text('Overall Statistics', 160,135)
  text('Category-wise', 330, 125)
  text('statistics', 350, 140)
  text('Age-wise statistics', 460, 135)

  if(main_toggle_state==0) {
    overall_statistics();
  } else if(main_toggle_state==1){
    category_wise_statistics();
  }else if(main_toggle_state==2){
    age_wise_statistics();
  }

  line(110, canvasHeight-130, canvasWidth-110, canvasHeight-130)
  text('Key takeaways:',110, canvasHeight-110)
}

function overall_statistics() {

  line(v1_bar_chart_x_position, v1_bar_chart_y_position+30, v1_bar_chart_x_position, v1_bar_chart_y_position+310)
  line(v1_bar_chart_x_position+650, v1_bar_chart_y_position+30, v1_bar_chart_x_position+650, v1_bar_chart_y_position+310)
  line(v1_bar_chart_x_position, v1_bar_chart_y_position+30, v1_bar_chart_x_position+650, v1_bar_chart_y_position+30)
  line(v1_bar_chart_x_position, v1_bar_chart_y_position+310, v1_bar_chart_x_position+650, v1_bar_chart_y_position+310)


  textSize(12)
  let scaling = 5
  let drug_name_y_scaling = 14
  for(let i=0; i<=4;i++){
    let total_users = total_data.get(i+1,"total_users");
    let addicted_users = total_data.get(i+1,"addicted_users")
    if(total_users<500){
      let addicted_width = round((addicted_users/total_users)*total_users)
      fill(0)
      rect(v1_bar_chart_x_position, v1_bar_chart_y_position+((i+1)*50), total_users,30)
      fill(255)
      rect(v1_bar_chart_x_position, v1_bar_chart_y_position+ ((i+1)*50), addicted_width,30)
      fill(0)
      text(round((addicted_users/total_users)*100)+"%", v1_bar_chart_x_position+addicted_width/2, v1_bar_chart_y_position+((i+1)*54+drug_name_y_scaling))
      // print(total_users)
      // text(total_users, (v1_bar_chart_x_position+total_users+10), v1_bar_chart_y_position+((i+1)*54+drug_name_y_scaling))

    }else if(total_users>5000){
      let scaling = 17
      let addicted_width=  round((addicted_users/scaling)/(total_users/scaling)*(total_users/scaling))
      fill(0)
      rect(v1_bar_chart_x_position, v1_bar_chart_y_position+((i+1)*50), total_users/scaling,30)
      fill(255)
      rect(v1_bar_chart_x_position, v1_bar_chart_y_position+ ((i+1)*50), addicted_width,30)
      fill(0)
      text(round((addicted_users/scaling)/(total_users/scaling)*100)+"%", v1_bar_chart_x_position+addicted_width/3, v1_bar_chart_y_position+((i+1)*54+drug_name_y_scaling))

    } else{
      let scaling = 3
      let addicted_width= round(((addicted_users/scaling)/(total_users/scaling))*(total_users/scaling))
      fill(0)
      rect(v1_bar_chart_x_position, v1_bar_chart_y_position+((i+1)*50), total_users/scaling,30)
      fill(255)
      rect(v1_bar_chart_x_position, v1_bar_chart_y_position+ ((i+1)*50), addicted_width,30)
      fill(0)
              text(round((addicted_users/scaling)/(total_users/scaling)*100)+"%", v1_bar_chart_x_position+addicted_width/2-7, v1_bar_chart_y_position+((i+1)*54+drug_name_y_scaling))
    }
    drug_name_y_scaling-=3
  }
  drug_name_y_scaling=14
  fill(0)
  for(let i=0;i<=4;i++){
    let drug_name = total_data.get(i+1,"drug")
    text(drug_name, v1_bar_chart_x_position-v1_drug_name_x_scaling[i], v1_bar_chart_y_position+(i+1)*54+drug_name_y_scaling)
    drug_name_y_scaling-=3
  }
  textSize(14)

  let total_users = int(total_age_data.get(0,"12-17"))+int(total_age_data.get(0,"18-25"))+int(total_age_data.get(0,"26-34"))+int(total_age_data.get(0,"35-49"))+int(total_age_data.get(0,"50+"))

  let angles=[round(int(total_age_data.get(0,"12-17"))/total_users*100), round(int(total_age_data.get(0,"18-25"))/total_users*100), round(int(total_age_data.get(0,"26-34"))/total_users*100), round(int(total_age_data.get(0,"35-49"))/total_users*100), round(int(total_age_data.get(0,"50+"))/total_users*100)]

  pieChart(250,angles)
  fill(0)
}

function pieChart(diameter, data) {
  var sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  var range = 2.0 * PI / sum;
  var lastAngle = 0;
  for (let i = 0; i < data.length; i++) {
    fill(map(i, 0, data.length, 0, 255));
    arc(v1_pie_x_position, v1_pie_y_position, diameter, diameter, lastAngle, lastAngle += data[i] * range );
    fill(255)
    text(data[i]+"%",v1_pie_x_position-v1_pie_data_x_position[i], v1_pie_y_position-v1_pie_data_y_position[i])
  }
}

function category_wise_statistics() {

  fill('hsba(190, 100%, 50%,1)');
  rect(v2_toggle_x_position, v2_toggle_y_position, 80, 20,20);
  if(drawCrosses){
    fill('hsba(0, 100%, 50%)');
    circle(v2_toggle_x_position+65, v2_toggle_y_position+10, 20)
    text('#', v2_toggle_x_position+10,v2_toggle_y_position+15)
  }else{
    fill('hsba(0, 100%, 50%)');
    circle(v2_toggle_x_position+15, v2_toggle_y_position+10, 20)
    text('%', v2_toggle_x_position+60,v2_toggle_y_position+15)
  }

  fill(0);
  textSize(14);
  for(i=0; i<5;i++){
        drug = total_data.get(i+1, 'drug')
        drug_users = total_data.get(i+1,'total_users')
        drug_addicts = total_data.get(i+1,'addicted_users')
        addicted_to_total = round((drug_addicts/drug_users) * 100)

        if(i<=1) {
          venn_x_position = category_venn_position;
          venn_y_position = category_venn_y_position;
          drug_name_x_position = drug_name_position;
          drug_name_y_position = 495;
          total_y_position = total_n_addicted_y_position;
        } 
        else {
          venn_x_position = 10;
          venn_y_position = 1000;
          drug_name_x_position = -30;
          drug_name_y_position = 795;
          total_y_position = 560;
      }

        //write drug name below
        fill(0);
        text(drug,(drug_name_x_position+(i*240)),drug_name_y_position);

        // outer circle
        let c1 = color('#008000');
        fill(c1);
        t = (log(drug_users)) * total_circle_scaling;
        hover_position_x[i] = total_n_addicted_circle_position[i];
        hover_position_y[i] = total_y_position;
        hover_diameter[i] = t
        circle(total_n_addicted_circle_position[i],total_y_position,t);

        // inner circle
        let c2 = color('white');
        fill(c2);
        r = t*((drug_addicts/drug_users) **0.5);
        circle(total_n_addicted_circle_position[i],total_y_position,r);

        let values = [affected_data.get(i,'crime'),
                      affected_data.get(i,'mental'),
                      affected_data.get(i,'unemployment'),
                      affected_data.get(i,'crime_mental'),
                      affected_data.get(i,'crime_unemployment'),
                      affected_data.get(i,'mental_unemployment'),
                      affected_data.get(i,'INTERSECTION')];
        let affected_data_union = affected_data.get(i,'UNION');

      if(!drawCrosses){
          fill(v2_venn_chart_color[0]);
          ellipse(venn_x_position+(i*240),(venn_y_position-350),120,120)
          fill(v2_venn_chart_color[1]);
          ellipse((venn_x_position-40)+(i*240),(venn_y_position-280),120,120)
          fill(v2_venn_chart_color[2]);
          ellipse((venn_x_position+40)+(i*240),(venn_y_position-280),120,120)
          fill(0)

          text(values[0],(venn_x_position-10)+(i*240),(venn_y_position-370))
          text(values[1],(venn_x_position-70)+(i*240),(venn_y_position-250))
          text(values[2],(venn_x_position+50)+(i*240),(venn_y_position-250))
          text(values[3],(venn_x_position-40)+(i*240),(venn_y_position-310))
          text(values[4],(venn_x_position+25)+(i*240),(venn_y_position-310))
          text(values[5],(venn_x_position-5)+(i*240),(venn_y_position-250))
          text(values[6],(venn_x_position-5)+(i*240),(venn_y_position-300))
        }
        else{
          fill(v2_venn_chart_color[0]);
          ellipse(venn_x_position+(i*240),(venn_y_position-350),120,120)
          fill(v2_venn_chart_color[1]);
          ellipse((venn_x_position-40)+(i*240),(venn_y_position-280),120,120)
          fill(v2_venn_chart_color[2]);
          ellipse((venn_x_position+40)+(i*240),(venn_y_position-280),120,120)
          fill(0)
          text(round(100*values[0]/affected_data_union)+"%",(venn_x_position-10)+(i*240),(venn_y_position-370))
          text(round(100*values[1]/affected_data_union)+"%",(venn_x_position-70)+(i*240),(venn_y_position-250))
          text(round(100*values[2]/affected_data_union)+"%",(venn_x_position+50)+(i*240),(venn_y_position-250))
          text(round(100*values[3]/affected_data_union)+"%",(venn_x_position-40)+(i*240),(venn_y_position-310))
          text(round(100*values[4]/affected_data_union)+"%",(venn_x_position+25)+(i*240),(venn_y_position-310))
          text(round(100*values[5]/affected_data_union)+"%",(venn_x_position-5)+(i*240),(venn_y_position-250))
          text(round(100*values[6]/affected_data_union)+"%",(venn_x_position-5)+(i*240),(venn_y_position-300))
        }

        rect((venn_x_position+110)+(i*240), (venn_y_position-220)-rect_scaling*affected_data.get(i,'UNION'), 10, rect_scaling*affected_data.get(i,'UNION'));
  }

  //legend
  let legend_circle_y_position = 600
  fill(v2_venn_chart_color[0]);
  ellipse((i*230),legend_circle_y_position-70,50,50)
  fill(v2_venn_chart_color[1]);
  ellipse(-20+(i*230),legend_circle_y_position-40,50,50)
  fill(v2_venn_chart_color[2]);
  ellipse(20+(i*230),legend_circle_y_position-40,50,50)

  let legend_line_y_position = legend_circle_y_position-10
  line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180, legend_line_y_position-70, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+250, legend_line_y_position-70)
    line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+210, legend_line_y_position-30, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+250, legend_line_y_position-30)
    line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+165, legend_line_y_position+10, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+250, legend_line_y_position+10)
    line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+165, legend_line_y_position-20, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+165, legend_line_y_position+10)
  fill(10)
  let legend_text_y_position = legend_circle_y_position-5
  text('Criminal', 1220, legend_text_y_position-70)
  text('Unemployed', 1220, legend_text_y_position-30)
  text('Mentally ill', 1220, legend_text_y_position+10)

    // legend for total users circle
    fill(color('#008000'));
    circle(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+150,legend_circle_y_position-200,50);

    // legend for addicted users circle
    fill(color('white'));
    circle(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+150,legend_circle_y_position-200,25);

  fill(color('black'));
  line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+135, legend_circle_y_position-210, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180, legend_circle_y_position-250);
    text('# of Drug Users on Log Scale', total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+185, legend_circle_y_position-250);
    line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+150, legend_circle_y_position-195, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180, legend_circle_y_position-175);
    text('Fraction of addicted drug users', total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+185, legend_circle_y_position-170);

  //Interaction hover
  let mouseOnBox = false;
  
  // This is for tooltip
  for(let j=0; j<5;j++){

    let drug_users = total_data.get(j+1,'total_users')
    let drug_addicts = total_data.get(j+1,'addicted_users')
    let addicted_to_total = round((drug_addicts/drug_users) * 100)

    if((mouseX-hover_position_x[j])**2 +
       (mouseY-hover_position_y[j])**2 <= (hover_diameter[j]/2)**2) {
      mouseOnBox = true;
      fill(255);
      // if(j==4){
      //   fill(255);
      //   rect(total_n_addicted_circle_position[j] ,hover_position_y[j],160,90);
      //   fill(1);
      //   text(('Drug: ' + total_data.get(j+1,'drug')), total_n_addicted_circle_position[j]-5,hover_position_y[j]);
      //   text(('# drug users: ' + drug_users), total_n_addicted_circle_position[j] - 5,hover_position_y[j]);
      //   text(('# drug addicts: ' + drug_addicts), total_n_addicted_circle_position[j]-5,hover_position_y[j]);
      //   text(('% of addicts: ' + addicted_to_total + '%'), total_n_addicted_circle_position[j]-5,hover_position_y[j]);
      // } else {
        fill(255);
        rect((total_n_addicted_circle_position[j]-130),(hover_position_y[j]-90),130,90);
        fill(1);
        text(('Drug: ' + total_data.get(j+1,'drug')), (total_n_addicted_circle_position[j]-125),(hover_position_y[j]-75));
        text(('# drug users: ' + drug_users), (total_n_addicted_circle_position[j]-125),(hover_position_y[j]-55));
        text(('# drug addicts: ' + drug_addicts), (total_n_addicted_circle_position[j]-125),(hover_position_y[j]-35));
        text(('% of addicts: ' + addicted_to_total + '%'), (total_n_addicted_circle_position[j]-125),(hover_position_y[j]-15));
      // }
    }
  }


}


function age_wise_statistics() {
  let k1 = color(120)
  for(let i=0; i<=4;i++){
    if(v3_toggle_state!=i){
      k1.setAlpha(200)
    }
    else{
      k1.setAlpha(10) 
    }
    fill(k1)  
    rect(v3_toggle_x_position+(i*drug_toggle_offset), v3_toggle_y_position, drug_toggle_offset, 40)
  }
  fill(0)
  text('Marijuana', (v3_toggle_x_position+10), (v3_toggle_y_position+25))
  text('Cocaine', (v3_toggle_x_position+drug_toggle_offset+10), (v3_toggle_y_position+25))
  text('Heroin', (v3_toggle_x_position+2*drug_toggle_offset+10), (v3_toggle_y_position+25))
  text('Hallucinogen', (v3_toggle_x_position+3*drug_toggle_offset+10), (v3_toggle_y_position+25))
  text('Methamphetamine', (v3_toggle_x_position+4*drug_toggle_offset+10), (v3_toggle_y_position+25))

    drug = total_data.get(v3_toggle_state+1, 'drug')
    drug_users = total_data.get(v3_toggle_state+1,'total_users')
    drug_addicts = total_data.get(v3_toggle_state+1,'addicted_users')
    addicted_to_total = round((drug_addicts/drug_users) * 100)

    //write drug name below
    fill(0);
    text(drug,(v3_drug_venn_x_position-35),(v3_drug_venn_y_position+310));

    // outer circle
    fill(color('#008000'));
    t = (log(drug_users)) * total_circle_scaling;
    // hover_position[i] = t;
    circle(v3_drug_venn_x_position,v3_drug_venn_y_position,t);

    // inner circle
    fill(color('white'));
    r = t*((drug_addicts/drug_users) **0.5);
    circle(v3_drug_venn_x_position,v3_drug_venn_y_position,r);

    let values = [affected_data.get(v3_toggle_state,'crime'),
                affected_data.get(v3_toggle_state,'mental'),
                affected_data.get(v3_toggle_state,'unemployment'),
                affected_data.get(v3_toggle_state,'crime_mental'),
                affected_data.get(v3_toggle_state,'crime_unemployment'),
                affected_data.get(v3_toggle_state,'mental_unemployment'),
                affected_data.get(v3_toggle_state,'INTERSECTION')];
    let affected_data_union = affected_data.get(v3_toggle_state,'UNION');

    colorMode(RGB, 100);
    fill(100,0,0,15);
    ellipse(v3_drug_venn_x_position,(v3_drug_venn_y_position+120),150,150)
    fill(0,100,0,15);
    ellipse((v3_drug_venn_x_position-40),(v3_drug_venn_y_position+210),150,150)
    fill(0,0,100,15);
    ellipse((v3_drug_venn_x_position+40),(v3_drug_venn_y_position+210),150,150)
    fill(0)

    text(values[0],(v3_drug_venn_x_position-10),(v3_drug_venn_y_position+90))
    text(values[1],(v3_drug_venn_x_position-90),(v3_drug_venn_y_position+ 240))
    text(values[2],(v3_drug_venn_x_position+70),(v3_drug_venn_y_position+ 240))
    text(values[3],(v3_drug_venn_x_position-50),(v3_drug_venn_y_position+ 160))
    text(values[4],(v3_drug_venn_x_position+35),(v3_drug_venn_y_position+ 160))
    text(values[5],(v3_drug_venn_x_position-10),(v3_drug_venn_y_position+ 240))
    text(values[6],(v3_drug_venn_x_position-10),(v3_drug_venn_y_position+ 180))

  colorMode(RGB, 255)

  let age_chart_offset = 200;
  fill(0)
  textSize(18);
  text(drug + ' addiction statistics on specific population age demographies', (v3_drug_venn_x_position+age_chart_offset), v3_drug_venn_y_position)

  textSize(14);
  line(v3_drug_venn_x_position+300,v3_drug_venn_y_position+20, v3_drug_venn_x_position+300, v3_drug_venn_y_position+160)
  for(let cat=0;cat<=2;cat++) {
    let x = (v3_drug_venn_x_position+250);
    let y = v3_drug_venn_y_position + 30 + cat * 40
    fill(0);
    text(age_chart_category[cat], x-50, y+25)
    for(let age=0;age<=3;age++) {
      fill(age_chart_color[age])

      let width = age_chart_rectangle_position[2]*drugArrays[v3_toggle_state][cat][age]
      rect(x+50,y+5,width,age_chart_rectangle_position[3]-20)
      if(drugArrays[v3_toggle_state][cat][age]>0.05){
        fill(1);
        text(round(100*drugArrays[v3_toggle_state][cat][age])+'%', x+45+0.35*width, y+25);
      }
      x+=width
    }
  }

  let x_offset = 90
  let width_offset = 0.8
  for(let cat=0;cat<=2;cat++) {
    let x = (v3_drug_venn_x_position+250);
    let y = v3_drug_venn_y_position + 200 + cat * 40
    fill(0);
    text(age_below_chart_category[cat], x-50, y+25)
    for(let age=0;age<=3;age++) {
      fill(age_chart_color[age])

      let width = age_chart_rectangle_position[2]*drugAgeArray[v3_toggle_state][cat][age]
      rect(x+x_offset,y+5,width_offset*width,age_chart_rectangle_position[3]-20)
      if(drugAgeArray[v3_toggle_state][cat][age]>0.05){
        fill(1);
        text(round(100*drugAgeArray[v3_toggle_state][cat][age])+'%', x+(x_offset-5)+0.35*(width*width_offset), y+25);
      }
      x+=width_offset*width
    }
    width_offset+=0.1
    x_offset-=20
  }

  //legend for age-group
  for (index = 0; index < age_chart_color.length; index++){
    fill(age_chart_color[index]);
  rect(age_legend_rect_position[age_legend_rect_position.length-1]+180, 440+20*index, 60, 10);
    fill(1);
    text(age_legend[index], age_legend_rect_position[age_legend_rect_position.length-1]+250, 450+20*index)
    }
}

function mouseClicked() {
  for(let i=0;i<=2;i++) {
    if(mouseX > main_toggle_x_position[i] &&
       mouseX < (main_toggle_x_position[i]+150) &&
       mouseY > main_toggle_y_position &&
       mouseY < (main_toggle_y_position + 40)){
      main_toggle_state = i;
      break;
    }
  }

  if(mouseX>=v2_toggle_x_position+10 && mouseX <= v2_toggle_x_position+20 && mouseY>=v2_toggle_y_position && mouseY<=v2_toggle_y_position+20){
      drawCrosses = false;
  }
  else if(mouseX>=v2_toggle_x_position+60 && mouseX <= v2_toggle_x_position+70 && mouseY>=v2_toggle_y_position && mouseY<=v2_toggle_y_position+20){
      drawCrosses = true;
  }

  for(let i=0;i<=4;i++){
    if(mouseX > (v3_toggle_x_position+(i*drug_toggle_offset)) &&
       mouseX < (v3_toggle_x_position+((i+1)*drug_toggle_offset)) &&
       mouseY > v3_toggle_y_position &&
       mouseY < (v3_toggle_y_position + 40)){
      v3_toggle_state=i;
      break;
    }
  }
}
