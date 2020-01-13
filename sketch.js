let total_data;
let affected_data;
let drug_data = [];
let drug_name;
let hover_position = [];
let drugArrays = []; // 3-dimentional array for plotting venn diagram
let age_chart_state = -1;
let drawCrosses = false
let main_toggle_state = 1;

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

// Color
let age_chart_color = ['#00FF00', 'yellow', '#D2691E', '#7FFFD4']


let age_chart_category = ['Crime', 'Mental Health', 'Unemployment']
let age_legend = ['18-25 years', '26-34 years','35-49 years', '50+ years']


let fileNames = ['marijuana_category.csv', 'cocaine_category.csv', 'heroin_category.csv', 'hallucinogen_category.csv', 'methamphetamine_category.csv']
function preload() {
  total_data = loadTable('real_data.csv','csv','header')

  affected_data = loadTable('ellipse_data.csv', 'csv', 'header')

  for(let drug=0;  drug<=4;drug++){
    drug_data[drug] = loadTable(fileNames[drug], 'csv', 'header')
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

  fill(180)
  for(let i=0; i<=2;i++){
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

  line(110, canvasHeight-100, canvasWidth-110, canvasHeight-100)
  text('Key takeaways:',110, canvasHeight-80)
}

function overall_statistics() {
  text('H1', 300,300)
}


function category_wise_statistics() {
  if(drawCrosses){
    fill(100);
    rect(v2_toggle_x_position, v2_toggle_y_position, 80, 20);
    fill(0);
    rect(v2_toggle_x_position+80, v2_toggle_y_position, 80, 20);
  }
  else{
    fill(0);
    rect(v2_toggle_x_position, v2_toggle_y_position, 80, 20);
    fill(100);
    rect(v2_toggle_x_position+80, v2_toggle_y_position, 80, 20);
  }

  fill(0);
  textSize(14);
  for(i=0; i<5;i++){

    let drug = total_data.get(i+1, 'drug')
    let drug_users = total_data.get(i+1,'total_users')
    let drug_addicts = total_data.get(i+1,'addicted_users')
    let addicted_to_total = round((drug_addicts/drug_users) * 100)

    if(i<=1) {
    venn_x_position = category_venn_position;
    venn_y_position = category_venn_y_position;
    drug_name_x_position = drug_name_position;
    drug_name_y_position = 495;
    total_y_position = total_n_addicted_y_position;
  } else {
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
    hover_position[i] = t;
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
      colorMode(RGB, 100);
      fill(100,0,0,15);
      ellipse(venn_x_position+(i*240),(venn_y_position-350),120,120)
      fill(0,100,0,15);
      ellipse((venn_x_position-40)+(i*240),(venn_y_position-280),120,120)
      fill(0,0,100,15);
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
     colorMode(RGB, 100);
      fill(100,0,0,15);
      ellipse(venn_x_position+(i*240),(venn_y_position-350),120,120)
      fill(0,100,0,15);
      ellipse((venn_x_position-40)+(i*240),(venn_y_position-280),120,120)
      fill(0,0,100,15);
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

  let mouseOnBox = false;
  // This is for tooltip
  for(let j=0; j<5;j++){

    let drug_users = total_data.get(j+1,'total_users')
    let drug_addicts = total_data.get(j+1,'addicted_users')
    let addicted_to_total = round((drug_addicts/drug_users) * 100)

    if((mouseX-total_n_addicted_circle_position[j])**2 +
       (mouseY-250)**2 <= (hover_position[j]/2)**2) {
      mouseOnBox = true;
      fill(255);
      if(j==4){
        fill(255);
        rect(0.99*total_n_addicted_circle_position[j] ,total_n_addicted_y_position,160,90);
        fill(1);
        text(('Drug: ' + total_data.get(j+1,'drug')), total_n_addicted_circle_position[j]-5,110);
      text(('# drug users: ' + drug_users), total_n_addicted_circle_position[j] - 5,130);
      text(('# drug addicts: ' + drug_addicts), total_n_addicted_circle_position[j]-5,150);
      text(('% of addicts: ' + addicted_to_total + '%'), total_n_addicted_circle_position[j]-5,170);
      } else {
        fill(255);
        rect((total_n_addicted_circle_position[j]-130),(total_n_addicted_y_position-90),130,90);
        fill(1);
        text(('Drug: ' + total_data.get(j+1,'drug')), (total_n_addicted_circle_position[j]-125),(total_n_addicted_y_position-75));
      text(('# drug users: ' + drug_users), (total_n_addicted_circle_position[j]-125),(total_n_addicted_y_position-55));
      text(('# drug addicts: ' + drug_addicts), (total_n_addicted_circle_position[j]-125),(total_n_addicted_y_position-35));
      text(('% of addicts: ' + addicted_to_total + '%'), (total_n_addicted_circle_position[j]-125),(total_n_addicted_y_position-15));
      }
    }
  }
}


function age_wise_statistics() {
    text('H3', 330,300)
}
// function draw() {
//   background('#FFFAFA');

//   textSize(50)
//   text('Drug Addiction Statistics in the US for 2017', 200, 70)
//   textSize(15);
//   stroke(180)
//   line(0,90,1450,90)

// //  stroke(0)

// //   text('Five most abused Illicit drugs in the US and the', 615, 130)
// //   text('proportionate affected users in different categories for each drug', 580, 150)

// //   textFont('fantasy');
// //   textSize(12);
// //   text('* According to the National Survey on Drug Use and Health', 40, 250)
// //   text('(NSDUH), 19.7 million American adults (aged 18 and older)', 50, 270)
// //   text('battled a substance use disorder in 2017.', 50, 290)

// //   text('* About 38% of adults in 2017 battled an illicit drug use disorder.', 40, 320)

// //   text('* Teenagers and people with mental health disorders are more', 40, 350)
// //   text('at risk for drug use and addiction than other populations.', 50, 370)
// //   textSize(11);

// //   textFont('serif');

// //   fill('red')
// //   text('Note: Click on the above drug to see detailed age demographic statistics', 410, 430)
//   if(drawCrosses){
//   fill(0);
//   rect(10, 100, 40, 20);
//   fill(50);
//   rect(50, 100, 40, 20);
//   }
//   else{
//   fill(0);
//   rect(50, 100, 40, 20);
//   fill(50);
//   rect(10, 100, 40, 20);
//   }
//   fill(0);
//   textSize(14);
//   for(i=0; i<5;i++){

//     let drug = total_data.get(i+1, 'drug')
//     let drug_users = total_data.get(i+1,'total_users')
//     let drug_addicts = total_data.get(i+1,'addicted_users')
//     let addicted_to_total = round((drug_addicts/drug_users) * 100)

//     //write drug name below
//     fill(0);
//     text(drug,drug_name_position[i],405);

//     // outer circle
//     let c1 = color('#008000');
//     fill(c1);
//     t = (log(drug_users)) * total_circle_scaling;
//     hover_position[i] = t;
//     circle(total_n_addicted_circle_position[i],170,t);

//     // inner circle
//     let c2 = color('white');
//     fill(c2);
//     //r = addicted_to_total;
//     r = t*((drug_addicts/drug_users) **0.5);
//     circle(total_n_addicted_circle_position[i],170,r);


//   if(!drawCrosses){
//       colorMode(RGB, 100);
//       fill(100,0,0,15);
//       ellipse(100+(i*240),260,120,120)
//       fill(0,100,0,15);
//       ellipse(60+(i*240),330,120,120)
//       fill(0,0,100,15);
//       ellipse(140+(i*240),330,120,120)
//       fill(0)
//       text(affected_data.get(i,'crime'),93+(i*240),245)
//       text(affected_data.get(i,'mental'),30+(i*240),350)
//       text(affected_data.get(i,'unemployment'),150+(i*240),350)
//       text(affected_data.get(i,'crime_mental'),62+(i*240),292)
//       text(affected_data.get(i,'crime_unemployment'),125+(i*240),292)
//       text(affected_data.get(i,'mental_unemployment'),95+(i*240),350)
//       text(affected_data.get(i,'INTERSECTION'),95+(i*240),310)
//     }
//     else{
//       colorMode(RGB, 100);
//       fill(100,0,0,15);
//       ellipse(100+(i*240),260,120,120)
//       fill(0,100,0,15);
//       ellipse(60+(i*240),330,120,120)
//       fill(0,0,100,15);
//       ellipse(140+(i*240),330,120,120)
//       fill(0)
//       let values = [round(100*affected_data.get(i,'crime')/affected_data.get(i,'UNION')),
//                     round(100*affected_data.get(i,'mental')/affected_data.get(i,'UNION')),
//                     round(100*affected_data.get(i,'unemployment')/affected_data.get(i,'UNION')),
//                     round(100*affected_data.get(i,'crime_mental')/affected_data.get(i,'UNION')),
//                     round(100*affected_data.get(i,'crime_unemployment')/affected_data.get(i,'UNION')),
//                     round(100*affected_data.get(i,'mental_unemployment')/affected_data.get(i,'UNION')),
//                     round(100*affected_data.get(i,'INTERSECTION')/affected_data.get(i,'UNION'))];
//       text(values[0]+"%",93+(i*240),245)
//       text(values[1]+"%",30+(i*240),350)
//       text(values[2]+"%",150+(i*240),350)
//       text(values[3]+"%",62+(i*240),292)

//       text(values[4]+"%",125+(i*240),292)
//       text(values[5]+"%",95+(i*240),350)
//       text(values[6]+"%",95+(i*240),310)
//     }
//     rect(210+(i*240), 400-rect_scaling*affected_data.get(i,'UNION'), 10, rect_scaling*affected_data.get(i,'UNION'));

//   }

//   let mouseOnBox = false;
//   // This is for tooltip
//   for(let j=0; j<5;j++){

//     let drug_users = total_data.get(j+1,'total_users')
//     let drug_addicts = total_data.get(j+1,'addicted_users')
//     let addicted_to_total = round((drug_addicts/drug_users) * 100)

//     if((mouseX-total_n_addicted_circle_position[j])**2 +
//        (mouseY-190)**2 <= (hover_position[j]/2)**2) {
//       mouseOnBox = true;
//       fill(255);
//       if(j==4){
//         fill(255);
//         rect(0.99*total_n_addicted_circle_position[j] ,93,160,90);
//         fill(1);
//         text(('Drug: ' + total_data.get(j+1,'drug')), total_n_addicted_circle_position[j]-5,110);
//       text(('# drug users: ' + drug_users), total_n_addicted_circle_position[j] - 5,130);
//       text(('# drug addicts: ' + drug_addicts), total_n_addicted_circle_position[j]-5,150);
//       text(('% of addicts: ' + addicted_to_total + '%'), total_n_addicted_circle_position[j]-5,170);
//       } else {
//         fill(255);
//         rect(total_n_addicted_circle_position[j] + 0.6*hover_position[j] ,110,130,90);
//         fill(1);
//         text(('Drug: ' + total_data.get(j+1,'drug')), total_n_addicted_circle_position[j] + 0.6*hover_position[j] + 5,125);
//       text(('# drug users: ' + drug_users), total_n_addicted_circle_position[j] + 0.6*hover_position[j] + 5,145);
//       text(('# drug addicts: ' + drug_addicts), total_n_addicted_circle_position[j] + 0.6*hover_position[j] + 5,165);
//       text(('% of addicts: ' + addicted_to_total + '%'), total_n_addicted_circle_position[j] + 0.6*hover_position[j] + 5,185);
//       }
//     }
//   }
//   // if(mouseOnBox){
//   //     cursor('grab');
//   // }
//   // else{
//   //   cursor(ARROW);
//   // }

//   // fill the below rectangles
//   if(age_chart_state>=0){
//     drawingContext.setLineDash([10, 25])
//     line(390,450,1400,450)
//     drawingContext.setLineDash([])

//     fill(0)
//     textSize(20);
//     text(drug_name + ' addiction statistics on specific population age demographies', 410, 500)

//     textSize(17);
//     text('Age Group', 1220, 510)

//     textSize(14);

//     for(let cat=0;cat<=2;cat++) {
//       let x = age_chart_rectangle_position[0];
//       let y = age_chart_rectangle_position[1] + cat * 60
//       fill(0);
//       text(age_chart_category[cat], x-150, y+age_chart_rectangle_position[3]/2)
//       for(let age=0;age<=3;age++) {
//         let agecolor = color(age_chart_color[age]);
//         agecolor.setAlpha(200);
//         fill(agecolor)

//         let width = age_chart_rectangle_position[2]*drugArrays[age_chart_state][cat][age]
//         rect(x,y,width,age_chart_rectangle_position[3])
//         if(drugArrays[age_chart_state][cat][age]>0.05){
//           fill(1);
//           text(round(100*drugArrays[age_chart_state][cat][age])+'%', x+0.35*width, y + 0.67*age_chart_rectangle_position[3]);
//         }
//         x+=width
//       }
//     }

//     //draw legend for bottom rectangles
//     for (index = 0; index < age_chart_color.length; index++) {
//       fill(age_chart_color[index]);
//       rect(age_legend_rect_position[age_legend_rect_position.length-1]+250, 560+50*index, 60, 10);
//       fill(1);
//       text(age_legend[index], age_legend_rect_position[age_legend_rect_position.length-1]+320, 568+50*index)
//     }
//   }

//   //top circles
//     colorMode(RGB, 100);
//     fill(100,0,0,15);
//     ellipse(60+(i*240),300,50,50)
//     fill(0,100,0,15);
//     ellipse(40+(i*240),330,50,50)
//     fill(0,0,100,15);
//     ellipse(80+(i*240),330,50,50)
//     stroke(0)
//     line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+210, 290, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+280, 290)
//     line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+230, 330, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+280, 330)
//     line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+185, 370, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+280, 370)
//     line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+185, 350, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+185, 370)
//     fill(0)
//     text('Crime', 1345, 294)
//     text('Unemployment', 1345, 334)
//     text('Mental Health', 1345, 374)


//   // outer circle
//     let c1 = color('#008000');
//     fill(c1);
//     circle(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180,190,50);

//     // inner circle
//     let c2 = color('white');
//     fill(c2);
//     circle(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180,190,25);

//     stroke(1);
//     fill(1);
//     textSize(11);
//     line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180, 170, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+220, 150);
//     text('Area of Outer Circle represents the \nnumber of Drug Users on Log Scale', total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+225, 155);
//     line(total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+180, 195, total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+220, 210);
//     text('Area of Inner Circle represents the \nfraction of all drug users who are addicted', total_n_addicted_circle_position[total_n_addicted_circle_position.length-1]+225, 220);
//     textSize(14);
// }

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

  if(mouseX>=v2_toggle_x_position && mouseX <= v2_toggle_x_position+80 && mouseY>=v2_toggle_y_position && mouseY<=v2_toggle_y_position+20){
      drawCrosses = false;
  }
  else if(mouseX>=v2_toggle_x_position+80 && mouseX <= v2_toggle_x_position+160 && mouseY>=v2_toggle_y_position && mouseY<=v2_toggle_y_position+20){
      drawCrosses = true;
  }
}
// function mouseClicked() {

//   let onBox = false;


//   for(let i=0;i<=4;i++) {
//     // if(mouseX > (rectArray[i]) &&
//     //    mouseX < (rectArray[i] + rectWidth) &&
//     //    mouseY > (220) &&
//     //    mouseY < (220 + rectHeight)){
//     if(((mouseX-(100+i*240))**2 + (mouseY-260)**2 <= 60**2) ||
//        ((mouseX-(60+i*240))**2 + (mouseY-330)**2 <= 60**2) ||
//        ((mouseX-(140+i*240))**2 + (mouseY-330)**2 <= 60**2)
//       ){
//         age_chart_state = i;
//         cursor('grab');
//         onBox = true;
//         drug_name = total_data.get(i+1, 'drug')
//         break;
//      }
//    }
//   if(!onBox){
//     age_chart_state = -1;
//     drug_name= ''
//   }
//   if(mouseX>=10 && mouseX <= 50 && mouseY>=100 && mouseY<=120){
//       drawCrosses = false;
//   }
//   else if(mouseX>=50 && mouseX <= 90 && mouseY>=100 && mouseY<=120){
//       drawCrosses = true;
//   }
// }
