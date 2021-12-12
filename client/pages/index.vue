<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="logo d-flex justify-center">
          <v-img src="img/bg.jpg"></v-img>
        </v-card>
        <v-card>
          <v-card-text class="text-center">
            <h1 style="color: white">Colonies</h1>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" nuxt block to="/interact"> Interact! </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <p>Interactive Artwork<br />2017<br />Acrylic, Aluminium, LEDs</p>
            <p>
              <strong>Colonies</strong> is a light installation inspired by the
              combinational strategy game Dots and Boxes.
            </p>
            <p>
              The rectangular grid that partitions the atrium is colonised by
              lines of light, that gradually appear and disappear, filling the
              structure with grouped patterns of colour.
            </p>
            <p>
              This interactive artwork has been designed with an Internet of
              Things approach with a programming interface that allows web
              developers to create programs that can modify and extend the
              original design and behaviour.
            </p>
            <p>
              <strong>Concept and design</strong> -
              <a href="http://www.installarchive.com/">Install Archive</a> (Luke
              Currall, Lee Regan)
            </p>
            <p>
              <strong
                >Lighting design, interaction design and programming</strong
              >
              - Arup (Francesco Anselmo, Inessa Demidova, Ben Hussey)
            </p>
            <p><strong>Fabrication</strong> - Keith Parker Fabrications</p>
            <p>
              <strong>
                Work kindly loaned by James Layfield, Founder of Central Working
              </strong>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
