/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/// <reference types="cypress" />
import demoInstance from '../../fixtures/demoInstance.json'

describe('chatterbox-staging.element.io test', () => {
  beforeEach(() => {
    cy.fixture('demoInstance').then(({url}) => {
      cy.visit(url)
    });
  });

  it('displays the chatterbox icon', () => {
    cy.get('.start').should('have.length', 1);
  });

  it('opens the chatterbox privacy window', () => {
    cy.get('.start > button').click();
    cy.frameLoaded('.chatterbox-iframe');
    cy.enter('.chatterbox-iframe').then(frame => {
      frame().find('.PolicyAgreementView_next').should('have.length', 1);
      frame().find('.PolicyAgreementView_cancel').should('have.length', 1);
    })
  });

  it('open the main chat window and sends a message', () => {
    cy.get('.start > button').click();
    cy.frameLoaded('.chatterbox-iframe');
    cy.enter('.chatterbox-iframe').then(frame => {
      frame().find('.PolicyAgreementView_next').click();
      cy.fixture('demoInstance').then(({headerName}) => {
        frame().find('.RoomHeaderView_name').should('have.text', headerName);
      });
      frame().find('.MessageComposer').should('have.length', 1);
      // Operator can take a long time to join
      frame().find('.Timeline .AnnouncementView', { timeout: 120000 }).should('have.text', 'operator joined the room');
      frame().find('.MessageComposer textarea').type('Hello world!{enter}');
      frame().find('.Timeline .Timeline_messageBody').should('contain.text', 'Hello world!');
      frame().find('.Timeline .Timeline_messageSender').should('text', 'me');
    })
  });
})
